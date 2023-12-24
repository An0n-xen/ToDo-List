package main

import (
	"fmt"
	"time"

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
	Tasks    []Task `gorm:"foreignKey:UserID" json:"tasks"`
}

type Task struct {
	ID          uint      `gorm:"primary_key"`
	Title       string    `gorm:"not null" json:"title"`
	Description string    `gorm:"not null" json:"description"`
	DueDate     time.Time `gorm:"not null" json:"due_date"`
	Completed   bool      `gorm:"not null" json:"completed"`
	UserID      uint      `gorm:"not null" json:"user_id"`
}

func createTask(c *gin.Context) {
	var userInput struct {
		Title       string    `json:"title" binding:"required"`
		Description string    `json:"description" binding:"required"`
		DueDate     time.Time `json:"due_date" binding:"required"`
		UserID      uint      `json:"user_id" binding:"required"`
	}

	if err := c.BindJSON(&userInput); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	task := Task{
		Title:       userInput.Title,
		Description: userInput.Description,
		DueDate:     userInput.DueDate,
		Completed:   false,
		UserID:      userInput.UserID,
	}

	db.Create(&task)

	c.JSON(200, gin.H{"message": "Task created successfully"})
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

func markTaskAsCompleted(c *gin.Context) {
	taskID := c.Param("id")

	var task Task

	if err := db.First(&task, taskID).Error; err != nil {
		c.JSON(400, gin.H{"error": "Task not found!"})
		return
	}

	task.Completed = true
	db.Save(&task)

	c.JSON(200, gin.H{"message": "Task marked as completed!"})
}

func deleteTask(c *gin.Context) {
	taskID := c.Param("id")

	var task Task

	if err := db.First(&task, taskID).Error; err != nil {
		c.JSON(400, gin.H{"error": "Task not found!"})
		return
	}

	db.Delete(&task)

	c.JSON(200, gin.H{"message": "Task deleted successfully!"})
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

	router.POST("/tasks", createTask)
	router.PUT("/tasks/:id", markTaskAsCompleted)
	router.DELETE("/tasks/:id", deleteTask)

	router.Run(":5000")
	fmt.Println("Server is running on port 5000")
}
