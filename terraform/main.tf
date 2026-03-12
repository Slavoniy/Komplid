# Данные ОС и Тарифа можно подтягивать динамически
data "twc_os" "ubuntu" {
  name    = "ubuntu"
  version = "22.04"
}

data "twc_presets" "preset" {
  price_filter {
    from = 300
    to   = 1000 # Ищем тариф примерно в этом диапазоне, подходящий под 2 CPU, 4 GB RAM
  }
}

# Добавляем SSH-ключ в аккаунт Timeweb
resource "twc_ssh_key" "deploy_key" {
  name       = "Deploy Key - ${var.project_name}"
  body       = var.ssh_public_key
}

# Создаем виртуальный сервер (VDS/VPS)
resource "twc_server" "app_server" {
  name  = "${var.project_name}-app-server"
  os_id = data.twc_os.ubuntu.id

  # Пример выбора тарифа: берем первый подходящий (в реальном проекте лучше указать точный ID preset_id)
  preset_id = var.preset_id

  # Прикрепляем SSH-ключ для беспарольного доступа
  ssh_keys_ids = [twc_ssh_key.deploy_key.id]

  # Задаем Cloud-init скрипт для автоматической настройки сервера при первом запуске
  cloud_init = file("${path.module}/cloud-init.yaml")
}
