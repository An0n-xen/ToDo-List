package main

import (
	"fmt"

	"example.com/Todo-list/handlers"
	"example.com/Todo-list/initializers"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func init() {
	err := godotenv.Load()

	if err != nil {
		fmt.Println("Error loading .env file")
	}
	initializers.ConnectDB()
}

func main() {
	router := gin.Default()

	// register user
	router.POST("/register", handlers.RegisterUser)

	// login user
	router.POST("/login", handlers.LoginUser)

	// Create Task
	router.POST("/tasks", handlers.CreateTask)

	// Update Task
	router.PUT("/tasks/:id", handlers.MarkTaskAsCompleted)

	// Get Tasks
	router.GET("/tasks/:id", handlers.GetTasks)

	// Delete Task
	router.DELETE("/tasks/:id", handlers.DeleteTask)

	router.Run(":5000")
	fmt.Println("Server is running on port 5000")
}
