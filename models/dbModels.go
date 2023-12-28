package models

import (
	"time"
)

type User struct {
	ID       uint   `gorm:"primary_key"`
	Username string `gorm:"not null" json:"username"`
	Password string `gorm:"not null" json:"password"`
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
