import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Calendar, Clock, User, Mail, Phone, CheckCircle } from 'lucide-react'
import './App.css'

function App() {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [availableTimes, setAvailableTimes] = useState([])

  // Serviços disponíveis
  const services = [
    { id: 'consulta', name: 'Consulta Geral', duration: 60, price: 'R$ 150,00' },
    { id: 'exame', name: 'Exame Médico', duration: 30, price: 'R$ 80,00' },
    { id: 'retorno', name: 'Consulta de Retorno', duration: 30, price: 'R$ 100,00' },
    { id: 'procedimento', name: 'Procedimento Especial', duration: 90, price: 'R$ 250,00' }
  ]

  // Horários disponíveis (simulação)
  const generateAvailableTimes = (date) => {
    const times = []
    const startHour = 8
    const endHour = 18
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        times.push(timeString)
      }
    }
    
    // Simular alguns horários já ocupados
    const occupiedTimes = ['09:00', '10:30', '14:00', '16:30']
    return times.filter(time => !occupiedTimes.includes(time))
  }

  useEffect(() => {
    if (selectedDate) {
      setAvailableTimes(generateAvailableTimes(selectedDate))
    }
  }, [selectedDate])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedDate && selectedTime && selectedService && clientInfo.name && clientInfo.email) {
      setIsSubmitted(true)
      // Aqui seria feita a chamada para a API do backend
      console.log('Agendamento:', {
        date: selectedDate,
        time: selectedTime,
        service: selectedService,
        client: clientInfo
      })
    }
  }

  const handleInputChange = (field, value) => {
    setClientInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const resetForm = () => {
    setSelectedDate('')
    setSelectedTime('')
    setSelectedService('')
    setClientInfo({ name: '', email: '', phone: '' })
    setIsSubmitted(false)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Agendamento Confirmado!</h2>
              <p className="text-gray-600 mb-4">
                Seu agendamento foi realizado com sucesso. Você receberá um e-mail de confirmação em breve.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4 text-left">
                <p><strong>Data:</strong> {new Date(selectedDate).toLocaleDateString('pt-BR')}</p>
                <p><strong>Horário:</strong> {selectedTime}</p>
                <p><strong>Serviço:</strong> {services.find(s => s.id === selectedService)?.name}</p>
                <p><strong>Cliente:</strong> {clientInfo.name}</p>
              </div>
              <Button onClick={resetForm} className="w-full">
                Fazer Novo Agendamento
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Agendamento Online</h1>
          <p className="text-xl text-gray-600">Agende sua consulta de forma rápida e fácil</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Seleção de Serviço e Data/Hora */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Selecione o Serviço e Horário
              </CardTitle>
              <CardDescription>
                Escolha o tipo de serviço e o horário desejado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Seleção de Serviço */}
              <div>
                <Label htmlFor="service">Tipo de Serviço</Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map(service => (
                      <SelectItem key={service.id} value={service.id}>
                        <div className="flex justify-between items-center w-full">
                          <span>{service.name}</span>
                          <span className="text-sm text-gray-500 ml-2">{service.price}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Seleção de Data */}
              <div>
                <Label htmlFor="date">Data</Label>
                <Input
                  type="date"
                  id="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Seleção de Horário */}
              {selectedDate && (
                <div>
                  <Label htmlFor="time">Horário Disponível</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um horário" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimes.map(time => (
                        <SelectItem key={time} value={time}>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {time}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações do Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Suas Informações
              </CardTitle>
              <CardDescription>
                Preencha seus dados para confirmar o agendamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={clientInfo.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">E-mail *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    value={clientInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    className="pl-10"
                    value={clientInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumo e Confirmação */}
        {selectedDate && selectedTime && selectedService && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Resumo do Agendamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900">Serviço</h4>
                  <p className="text-blue-700">{services.find(s => s.id === selectedService)?.name}</p>
                  <p className="text-sm text-blue-600">{services.find(s => s.id === selectedService)?.price}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900">Data</h4>
                  <p className="text-green-700">{new Date(selectedDate).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900">Horário</h4>
                  <p className="text-purple-700">{selectedTime}</p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  disabled={!clientInfo.name || !clientInfo.email}
                >
                  Confirmar Agendamento
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default App

