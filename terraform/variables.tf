variable "twc_token" {
  description = "Timeweb Cloud API Token"
  type        = string
  sensitive   = true
}

variable "project_name" {
  description = "Название проекта (для именования ресурсов)"
  type        = string
  default     = "constructiondocs"
}

variable "os_id" {
  description = "ID операционной системы в Timeweb (по умолчанию Ubuntu 22.04 LTS)"
  type        = number
  default     = 72 # Проверьте актуальный ID Ubuntu 22.04 в API Timeweb (или используйте name)
}

variable "preset_id" {
  description = "ID тарифа (например, 2 CPU, 4 GB RAM)"
  type        = number
  default     = 82 # Проверьте актуальный ID тарифа
}

variable "ssh_public_key" {
  description = "Публичный SSH ключ для доступа к серверу"
  type        = string
}
