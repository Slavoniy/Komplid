output "server_ip" {
  description = "IP адрес созданного сервера"
  value       = twc_server.app_server.networks[0].ips[0].ip
}

output "server_name" {
  description = "Имя сервера"
  value       = twc_server.app_server.name
}
