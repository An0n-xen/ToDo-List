package handlers

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"example.com/Todo-list/initializers"
	"example.com/Todo-list/models"
	"example.com/Todo-list/utilities"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func RegisterUser(c *gin.Context) {
	var userInput models.User

	if err := c.BindJSON(&userInput); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	fmt.Println(userInput)

	result, _ := utilities.IsUserExist(userInput.Username)

	if result {
		c.JSON(409, gin.H{"error": "User already exists!"})
		return
	}

	userInput.Password, _ = utilities.HashPassword(userInput.Password)

	results := initializers.DB.Create(&userInput)

	if results.Error != nil {
		c.JSON(400, gin.H{"error": results.Error.Error()})
		return
	}

	c.JSON(200, gin.H{"message": "User Successfully Registered"})
}

func LoginUser(c *gin.Context) {
	var userInput struct {
		Username string `json:"Username" binding:"required"`
		Password string `json:"Password" binding:"required"`
	}

	if err := c.BindJSON(&userInput); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	var user models.User

	if err := initializers.DB.Where("username = ?", userInput.Username).First(&user).Error; err != nil {
		c.JSON(404, gin.H{"error": "User not found!"})
		return
	}

	if !utilities.CheckPasswordHash(userInput.Password, user.Password) {
		c.JSON(400, gin.H{"error": "Incorrect Password!"})
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	// Sign and get the complete encoded token as a string using the secret
	tokenString, err := token.SignedString([]byte(os.Getenv("SECRET_KEY")))

	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to create token"})
		return
	}

	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("Authorization", tokenString, 3600*24, "", "", false, true)

	c.JSON(200, gin.H{"message": "Login Successful"})
}

func GetTasks(c *gin.Context) {
	userID := c.Param("id")

	var tasks []models.Task

	if err := initializers.DB.Find(&tasks, userID).Error; err != nil {
		c.JSON(400, gin.H{"error": "No tasks found!"})
		return
	}

	c.JSON(200, gin.H{"tasks": tasks})
}

func MarkTaskAsCompleted(c *gin.Context) {
	taskID := c.Param("id")

	var task models.Task

	if err := initializers.DB.First(&task, taskID).Error; err != nil {
		c.JSON(400, gin.H{"error": "Task not found!"})
		return
	}

	task.Completed = true
	initializers.DB.Save(&task)

	c.JSON(200, gin.H{"message": "Task marked as completed!"})

}

func DeleteTask(c *gin.Context) {
	taskID := c.Param("id")

	var task models.Task

	if err := initializers.DB.First(&task, taskID).Error; err != nil {
		c.JSON(400, gin.H{"error": "Task not found!"})
		return
	}

	initializers.DB.Delete(&task)

	c.JSON(200, gin.H{"message": "Task deleted!"})
}

func CreateTask(c *gin.Context) {

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

	task := models.Task{
		Title:       userInput.Title,
		Description: userInput.Description,
		DueDate:     userInput.DueDate,
		Completed:   false,
		UserID:      userInput.UserID,
	}

	initializers.DB.Create(&task)

	c.JSON(200, gin.H{"message": "Task created successfully!"})

}
