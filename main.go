package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type User struct {
	ID       uint   `gorm:"primary_key"`
	Username string `gorm:"unique;not null"`
	Password string `gorm:"not null"`
}

func registerUser(c *gin.Context) {
	var UserInput User

	if err := c.BindJSON(&UserInput); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	result := db.Create(&UserInput)

	if result.Error != nil {
		c.JSON(400, gin.H{"error": result.Error})
		return
	}

	c.JSON(200, gin.H{"data": "User created successfully"})

}

var db *gorm.DB

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

	router.Run(":5000")
	fmt.Println("Server is running on port 5000")
}
