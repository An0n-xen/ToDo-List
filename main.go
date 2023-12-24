package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"

	"gorm.io/gorm"

	"golang.org/x/crypto/bcrypt"
)

var db *gorm.DB

type User struct {
	ID       uint   `gorm:"primary_key"`
	Username string `gorm:"unique;not null"`
	Password string `gorm:"not null"`
}

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func checkPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func registerUser(c *gin.Context) {
	var UserInput User

	if err := c.BindJSON(&UserInput); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	UserInput.Password, _ = hashPassword(UserInput.Password)

	result := db.Create(&UserInput)

	if result.Error != nil {
		c.JSON(400, gin.H{"error": result.Error})
		return
	}

	c.JSON(200, gin.H{"username": "User Successfully Registered"})

}

func loginUser(c *gin.Context) {
	var userInput struct {
		Username string `json:"Username" binding:"required"`
		Password string `json:"Password" binding:"required"`
	}

	var user User

	err := c.BindJSON(&userInput)
	if err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := db.Where("username = ?", userInput.Username).First(&user).Error; err != nil {
		c.JSON(400, gin.H{"error": "User not found!"})
		return
	}

	if !checkPasswordHash(userInput.Password, user.Password) {
		c.JSON(400, gin.H{"error": "Incorrect Password!"})
		return
	}

	c.JSON(200, gin.H{"message": "Login Successful"})

}

func main() {
	dns := "user=postgres password='codeck prime' dbname=todolist port=5432 sslmode=disable"

	var err error

	db, err = gorm.Open(postgres.Open(dns), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database!")
	}

	// Initializing gin server
	router := gin.Default()

	router.POST("/register", registerUser)
	router.POST("/login", loginUser)

	router.Run(":5000")
	fmt.Println("Server is running on port 5000")
}
