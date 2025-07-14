// 360 Tinted Online Booking System
class BookingSystem {
    constructor() {
        this.currentStep = 1;
        this.maxSteps = 3;
        this.selectedService = null;
        this.selectedDate = null;
        this.selectedTime = null;
        this.services = [];
        this.availableTimes = [];
        
        // API base URL - adjust for production
        this.apiBase = 'https://api.360tinted.com/api';
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadServices();
        this.setMinDate();
    }

    bindEvents() {
        // Navigation buttons
        document.getElementById('nextBtn').addEventListener('click', () => this.nextStep());
        document.getElementById('prevBtn').addEventListener('click', () => this.prevStep());
        
        // Date change
        document.getElementById('appointmentDate').addEventListener('change', () => this.onDateChange());
        
        // Services button
        document.getElementById('servicesBtn').addEventListener('click', (e) => {
            e.preventDefault();
            window.open('https://www.360tinted.com/#services', '_blank');
        });
    }

    setMinDate() {
        // Set minimum date to today
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const dateInput = document.getElementById('appointmentDate');
        dateInput.min = tomorrow.toISOString().split('T')[0];
    }

    async loadServices() {
        try {
            this.showLoading(true);
            const response = await fetch(`${this.apiBase}/services`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.services = data;
            this.renderServices();
            this.showLoading(false);
        } catch (error) {
            console.error('Error loading services:', error);
            this.showError('Failed to load services. Please refresh the page and try again.');
            this.showLoading(false);
        }
    }

    renderServices() {
        const serviceGrid = document.getElementById('serviceGrid');
        serviceGrid.innerHTML = '';

        this.services.forEach(service => {
            const serviceCard = document.createElement('div');
            serviceCard.className = 'service-card';
            serviceCard.dataset.serviceKey = service.service_key;
            
            serviceCard.innerHTML = `
                <h3>${service.name}</h3>
                <div class="price">${service.price}</div>
                <div class="duration">${service.duration} minutes</div>
            `;
            
            serviceCard.addEventListener('click', () => this.selectService(service));
            serviceGrid.appendChild(serviceCard);
        });
    }

    selectService(service) {
        // Remove previous selection
        document.querySelectorAll('.service-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Add selection to clicked card
        document.querySelector(`[data-service-key="${service.service_key}"]`).classList.add('selected');
        
        this.selectedService = service;
        document.getElementById('selectedPrice').textContent = service.price;
        
        // Load available times if date is selected
        if (this.selectedDate) {
            this.loadAvailableTimes();
        }
    }

    async onDateChange() {
        const dateInput = document.getElementById('appointmentDate');
        this.selectedDate = dateInput.value;
        
        if (this.selectedDate && this.selectedService) {
            await this.loadAvailableTimes();
        }
    }

    async loadAvailableTimes() {
        if (!this.selectedDate || !this.selectedService) return;
        
        try {
            const response = await fetch(
                `${this.apiBase}/available-times?date=${this.selectedDate}&service_key=${this.selectedService.service_key}`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.availableTimes = data.available_times || [];
            this.renderTimeSlots();
        } catch (error) {
            console.error('Error loading available times:', error);
            this.showError('Failed to load available times. Please try again.');
        }
    }

    renderTimeSlots() {
        const timeSlotsContainer = document.getElementById('timeSlots');
        timeSlotsContainer.innerHTML = '';

        if (this.availableTimes.length === 0) {
            timeSlotsContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #666;">No available times for this date. Please select another date.</p>';
            return;
        }

        this.availableTimes.forEach(time => {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.textContent = time;
            timeSlot.dataset.time = time;
            
            timeSlot.addEventListener('click', () => this.selectTime(time));
            timeSlotsContainer.appendChild(timeSlot);
        });
    }

    selectTime(time) {
        // Remove previous selection
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });
        
        // Add selection to clicked slot
        document.querySelector(`[data-time="${time}"]`).classList.add('selected');
        
        this.selectedTime = time;
    }

    nextStep() {
        if (this.currentStep < this.maxSteps) {
            if (this.validateCurrentStep()) {
                this.currentStep++;
                this.updateStepDisplay();
                
                if (this.currentStep === 3) {
                    this.showAppointmentSummary();
                }
            }
        } else {
            // Final step - submit appointment
            this.submitAppointment();
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
        }
    }

    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                return this.validatePersonalInfo();
            case 2:
                return this.validateServiceSelection();
            case 3:
                return true; // Summary step, no validation needed
            default:
                return false;
        }
    }

    validatePersonalInfo() {
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        
        if (!fullName) {
            this.showError('Please enter your full name.');
            return false;
        }
        
        if (!email) {
            this.showError('Please enter your email address.');
            return false;
        }
        
        if (!this.isValidEmail(email)) {
            this.showError('Please enter a valid email address.');
            return false;
        }
        
        return true;
    }

    validateServiceSelection() {
        if (!this.selectedService) {
            this.showError('Please select a service.');
            return false;
        }
        
        if (!this.selectedDate) {
            this.showError('Please select a date.');
            return false;
        }
        
        if (!this.selectedTime) {
            this.showError('Please select a time.');
            return false;
        }
        
        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    updateStepDisplay() {
        // Update step indicators
        for (let i = 1; i <= this.maxSteps; i++) {
            const step = document.getElementById(`step${i}`);
            const section = document.getElementById(`section${i}`);
            
            if (i <= this.currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
            
            if (i === this.currentStep) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        }
        
        // Update navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (this.currentStep === 1) {
            prevBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'inline-block';
        }
        
        if (this.currentStep === this.maxSteps) {
            nextBtn.textContent = 'Book Appointment';
        } else {
            nextBtn.textContent = 'Next';
        }
    }

    showAppointmentSummary() {
        const summaryContainer = document.getElementById('appointmentSummary');
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const carDetails = document.getElementById('carDetails').value;
        
        const formattedDate = new Date(this.selectedDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        summaryContainer.innerHTML = `
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; border-left: 4px solid #007BFF;">
                <h3 style="margin-top: 0; color: #333;">Appointment Details</h3>
                
                <div style="margin-bottom: 20px;">
                    <strong>Client Information:</strong>
                    <p style="margin: 5px 0;"><strong>Name:</strong> ${fullName}</p>
                    <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                    ${phone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${phone}</p>` : ''}
                    ${carDetails ? `<p style="margin: 5px 0;"><strong>Car Details:</strong> ${carDetails}</p>` : ''}
                </div>
                
                <div style="margin-bottom: 20px;">
                    <strong>Service Information:</strong>
                    <p style="margin: 5px 0;"><strong>Service:</strong> ${this.selectedService.name}</p>
                    <p style="margin: 5px 0;"><strong>Price:</strong> ${this.selectedService.price}</p>
                    <p style="margin: 5px 0;"><strong>Duration:</strong> ${this.selectedService.duration} minutes</p>
                </div>
                
                <div>
                    <strong>Appointment Time:</strong>
                    <p style="margin: 5px 0;"><strong>Date:</strong> ${formattedDate}</p>
                    <p style="margin: 5px 0;"><strong>Time:</strong> ${this.selectedTime}</p>
                </div>
                
                <div style="margin-top: 30px; padding: 20px; background-color: #e7f3ff; border-radius: 5px;">
                    <h4 style="margin-top: 0; color: #0056b3;">Important Information:</h4>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>Please arrive 15 minutes early</li>
                        <li>Bring a valid ID</li>
                        <li>For cancellations, please contact us at least 24 hours in advance</li>
                        <li>Our address: 90 Glenn Way, San Carlos, CA, 94070</li>
                    </ul>
                </div>
            </div>
        `;
    }

    async submitAppointment() {
        try {
            this.showLoading(true, 'Booking your appointment...');
            
            const appointmentData = {
                client_name: document.getElementById('fullName').value,
                client_email: document.getElementById('email').value,
                client_phone: document.getElementById('phone').value || null,
                car_details: document.getElementById('carDetails').value || null,
                service_key: this.selectedService.service_key,
                appointment_date: this.selectedDate,
                appointment_time: this.selectedTime
            };
            
            const response = await fetch(`${this.apiBase}/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                // *** ADICIONE ESTA LINHA AQUI ***
                // Certifique-se de que 'fbq' está disponível globalmente (o que é garantido pelo seu HTML)
                if (typeof fbq === 'function') { // Boa prática para garantir que a função fbq existe
                    fbq('track', 'Lead'); // Ou fbq('track', 'Schedule'); se preferir este nome
                }
                // ******************************
                this.showSuccess('Appointment booked successfully! You will receive a confirmation email shortly.');
                this.resetForm();
            } else {
                throw new Error(result.error || 'Failed to book appointment');
            }
            
        } catch (error) {
            console.error('Error submitting appointment:', error);
            this.showError('Failed to book appointment. Please try again or contact us directly.');
        } finally {
            this.showLoading(false);
        }
    }

    resetForm() {
        // Reset form data
        document.getElementById('personalInfoForm').reset();
        this.selectedService = null;
        this.selectedDate = null;
        this.selectedTime = null;
        
        // Reset UI
        document.querySelectorAll('.service-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });
        document.getElementById('selectedPrice').textContent = 'Select a service';
        document.getElementById('timeSlots').innerHTML = '';
        
        // Go back to step 1
        this.currentStep = 1;
        this.updateStepDisplay();
    }

    showLoading(show, message = 'Loading...') {
        const loading = document.getElementById('loading');
        if (show) {
            loading.style.display = 'block';
            loading.querySelector('p').textContent = message;
        } else {
            loading.style.display = 'none';
        }
    }

    showSuccess(message) {
        this.hideMessages();
        const successMessage = document.getElementById('successMessage');
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        successMessage.scrollIntoView({ behavior: 'smooth' });
    }

    showError(message) {
        this.hideMessages();
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        errorMessage.scrollIntoView({ behavior: 'smooth' });
    }

    hideMessages() {
        document.getElementById('successMessage').style.display = 'none';
        document.getElementById('errorMessage').style.display = 'none';
    }
}

// Initialize the booking system when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new BookingSystem();
});

