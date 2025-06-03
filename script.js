 class ContactFormValidator {
            constructor() {
                this.form = document.getElementById('contactForm');
                this.nameInput = document.getElementById('name');
                this.emailInput = document.getElementById('email');
                this.messageInput = document.getElementById('message');
                this.submitBtn = document.getElementById('submitBtn');
                this.successMessage = document.getElementById('successMessage');
                
                this.validationRules = {
                    name: {
                        required: true,
                        minLength: 2,
                        maxLength: 50,
                        pattern: /^[a-zA-Z\s'-]+$/,
                        customValidation: this.validateName.bind(this)
                    },
                    email: {
                        required: true,
                        pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                        customValidation: this.validateEmail.bind(this)
                    },
                    message: {
                        required: true,
                        minLength: 10,
                        maxLength: 1000,
                        customValidation: this.validateMessage.bind(this)
                    }
                };

                this.initializeEventListeners();
                this.initializeCharacterCounter();
            }

            initializeEventListeners() {
                this.form.addEventListener('submit', this.handleSubmit.bind(this));
                
                this.nameInput.addEventListener('blur', () => this.validateField('name'));
                this.nameInput.addEventListener('input', () => this.clearFieldError('name'));
                
                this.emailInput.addEventListener('blur', () => this.validateField('email'));
                this.emailInput.addEventListener('input', () => this.clearFieldError('email'));
                
                this.messageInput.addEventListener('blur', () => this.validateField('message'));
                this.messageInput.addEventListener('input', () => {
                    this.clearFieldError('message');
                    this.updateCharacterCounter();
                });

                this.nameInput.addEventListener('input', this.debounce(() => this.validateField('name'), 500));
                this.emailInput.addEventListener('input', this.debounce(() => this.validateField('email'), 800));
            }

            initializeCharacterCounter() {
                const charCounter = document.getElementById('charCounter');
                const maxLength = parseInt(this.messageInput.getAttribute('maxlength'));
                
                this.messageInput.addEventListener('input', () => {
                    const currentLength = this.messageInput.value.length;
                    charCounter.textContent = `${currentLength} / ${maxLength} characters`;
                    
                    charCounter.className = 'char-counter';
                    if (currentLength > maxLength * 0.8) {
                        charCounter.classList.add('warning');
                    }
                    if (currentLength > maxLength * 0.95) {
                        charCounter.classList.remove('warning');
                        charCounter.classList.add('danger');
                    }
                });
            }

            updateCharacterCounter() {
                const charCounter = document.getElementById('charCounter');
                const currentLength = this.messageInput.value.length;
                const maxLength = 1000;
                
                charCounter.textContent = `${currentLength} / ${maxLength} characters`;
            }

            debounce(func, wait) {
                let timeout;
                return function executedFunction(...args) {
                    const later = () => {
                        clearTimeout(timeout);
                        func(...args);
                    };
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                };
            }

            validateName(value) {
                const trimmedValue = value.trim();
                
                if (!trimmedValue) {
                    return 'Name is required';
                }
                
                if (trimmedValue.length < 2) {
                    return 'Name must be at least 2 characters long';
                }
                
                if (trimmedValue.length > 50) {
                    return 'Name must not exceed 50 characters';
                }
                
                if (!/^[a-zA-Z\s'-]+$/.test(trimmedValue)) {
                    return 'Name can only contain letters, spaces, hyphens, and apostrophes';
                }
                
                if (trimmedValue.split(' ').length > 5) {
                    return 'Please enter a valid name (too many words)';
                }
                
                if (/\s{2,}/.test(trimmedValue)) {
                    return 'Please remove extra spaces from your name';
                }
                
                return null;
            }

            validateEmail(value) {
                const trimmedValue = value.trim().toLowerCase();
                
                if (!trimmedValue) {
                    return 'Email address is required';
                }
                
                const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
                
                if (!emailRegex.test(trimmedValue)) {
                    return 'Please enter a valid email address';
                }
                
                if (trimmedValue.length > 254) {
                    return 'Email address is too long';
                }
                
                const localPart = trimmedValue.split('@')[0];
                const domainPart = trimmedValue.split('@')[1];
                
                if (localPart.length > 64) {
                    return 'Email address local part is too long';
                }
                
                if (!domainPart || domainPart.length < 2) {
                    return 'Please enter a valid domain name';
                }
                
                if (domainPart.startsWith('.') || domainPart.endsWith('.')) {
                    return 'Domain name cannot start or end with a dot';
                }
                
                if (domainPart.includes('..')) {
                    return 'Domain name cannot contain consecutive dots';
                }
                
                const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com'];
                const suspiciousDomains = ['test.com', 'example.com', 'temp.com'];
                
                if (suspiciousDomains.includes(domainPart)) {
                    return 'Please enter a real email address';
                }
                
                return null;
            }

            validateMessage(value) {
                const trimmedValue = value.trim();
                
                if (!trimmedValue) {
                    return 'Message is required';
                }
                
                if (trimmedValue.length < 10) {
                    return 'Message must be at least 10 characters long';
                }
                
                if (trimmedValue.length > 1000) {
                    return 'Message must not exceed 1000 characters';
                }
                
                if (/(.)\1{4,}/.test(trimmedValue)) {
                    return 'Please avoid excessive repetition of characters';
                }
                
                const wordCount = trimmedValue.split(/\s+/).length;
                if (wordCount < 3) {
                    return 'Message should contain at least 3 words';
                }
                
                if (wordCount > 200) {
                    return 'Message is too long (maximum 200 words)';
                }
                
                const spamPatterns = [
                    /\b(buy now|click here|free money|guaranteed|no risk)\b/i,
                    /\$+\d+/g,
                    /[A-Z]{10,}/,
                    /!{3,}/
                ];
                
                for (let pattern of spamPatterns) {
                    if (pattern.test(trimmedValue)) {
                        return 'Message appears to contain spam-like content';
                    }
                }
                
                return null;
            }

            validateField(fieldName) {
                const input = document.getElementById(fieldName);
                const value = input.value;
                const rules = this.validationRules[fieldName];
                
                let error = null;
                
                if (rules.customValidation) {
                    error = rules.customValidation(value);
                }
                
                if (error) {
                    this.showFieldError(fieldName, error);
                    return false;
                } else {
                    this.clearFieldError(fieldName);
                    input.classList.add('success');
                    return true;
                }
            }

            showFieldError(fieldName, message) {
                const input = document.getElementById(fieldName);
                const errorElement = document.getElementById(fieldName + 'Error');
                const errorText = errorElement.querySelector('.error-text');
                
                input.classList.remove('success');
                input.classList.add('error');
                
                errorText.textContent = message;
                errorElement.classList.add('show');
            }

            clearFieldError(fieldName) {
                const input = document.getElementById(fieldName);
                const errorElement = document.getElementById(fieldName + 'Error');
                
                input.classList.remove('error');
                errorElement.classList.remove('show');
            }

            validateAllFields() {
                const fields = ['name', 'email', 'message'];
                let isValid = true;
                const errors = [];
                
                fields.forEach(field => {
                    const fieldValid = this.validateField(field);
                    if (!fieldValid) {
                        isValid = false;
                        const input = document.getElementById(field);
                        const errorElement = document.getElementById(field + 'Error');
                        const errorText = errorElement.querySelector('.error-text').textContent;
                        errors.push(`${field}: ${errorText}`);
                    }
                });
                
                this.updateFormStats(isValid, errors);
                return isValid;
            }

            updateFormStats(isValid, errors) {
                const statsDiv = document.getElementById('formStats');
                const statsContent = document.getElementById('statsContent');
                
                if (errors.length > 0) {
                    statsDiv.style.display = 'block';
                    statsContent.innerHTML = `
                        <span style="color: #e74c3c;">❌ ${errors.length} error(s) found:</span><br>
                        ${errors.map(error => `• ${error}`).join('<br>')}
                    `;
                } else if (isValid) {
                    statsDiv.style.display = 'block';
                    statsContent.innerHTML = '<span style="color: #27ae60;">✅ All fields are valid!</span>';
                    setTimeout(() => {
                        statsDiv.style.display = 'none';
                    }, 3000);
                }
            }

            async handleSubmit(e) {
                e.preventDefault();
                
                if (!this.validateAllFields()) {
                    this.submitBtn.style.animation = 'shake 0.5s ease-in-out';
                    setTimeout(() => {
                        this.submitBtn.style.animation = '';
                    }, 500);
                    return;
                }
                
                this.showLoadingState();
                
                try {
                    await this.simulateFormSubmission();
                    this.showSuccessMessage();
                } catch (error) {
                    this.showErrorMessage('Failed to send message. Please try again.');
                } finally {
                    this.hideLoadingState();
                }
            }

            showLoadingState() {
                this.submitBtn.disabled = true;
                document.getElementById('loadingSpinner').style.display = 'inline-block';
                document.getElementById('btnText').textContent = 'Sending...';
            }

            hideLoadingState() {
                this.submitBtn.disabled = false;
                document.getElementById('loadingSpinner').style.display = 'none';
                document.getElementById('btnText').textContent = 'Send Message';
            }

            async simulateFormSubmission() {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        console.log('Form Data:', {
                            name: this.nameInput.value.trim(),
                            email: this.emailInput.value.trim().toLowerCase(),
                            message: this.messageInput.value.trim(),
                            timestamp: new Date().toISOString(),
                            userAgent: navigator.userAgent
                        });
                        resolve();
                    }, 2000);
                });
            }

            showSuccessMessage() {
                this.form.style.display = 'none';
                this.successMessage.style.display = 'block';
                
                setTimeout(() => {
                    this.resetForm();
                }, 5000);
            }

            showErrorMessage(message) {
                alert(message);
            }

            resetForm() {
                this.form.reset();
                this.form.style.display = 'block';
                this.successMessage.style.display = 'none';
                
                ['name', 'email', 'message'].forEach(field => {
                    this.clearFieldError(field);
                    const input = document.getElementById(field);
                    input.classList.remove('success');
                });
                
                document.getElementById('formStats').style.display = 'none';
                this.updateCharacterCounter();
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            new ContactFormValidator();
        });

        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                document.getElementById('contactForm').dispatchEvent(new Event('submit'));
            }
        });