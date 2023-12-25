package handlers

import (
	"time"

	"example.com/Todo-list/initializers"
	"example.com/Todo-list/models"
	"example.com/Todo-list/utilities"
	"github.com/gin-gonic/gin"
)

func RegisterUser(c *gin.Context) {
	var UserInput models.User

	if err := c.BindJSON(&UserInput); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	UserInput.Password, _ = utilities.HashPassword(UserInput.Password)

	results := initializers.DB.Create(&UserInput)

	if results.Error != nil {
		c.JSON(400, gin.H{"error": results.Error})
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
		c.JSON(400, gin.H{"error": "User not found!"})
		return
	}

	if !utilities.CheckPasswordHash(userInput.Password, user.Password) {
		c.JSON(400, gin.H{"error": "Incorrect Password!"})
		return
	}

	c.JSON(200, gin.H{"message": "Login Successful"})
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
