class DisinfoSimulator {
    constructor(containerElement) {
      this.container = containerElement;
      this.messages = [];
      this.truthMessages = [];
      this.falseMessages = [];
      this.noiseLevel = 0;
      this.signalStrength = 100;
      this.initialize();
    }
    
    initialize() {
      // Create UI elements
      this.createControls();
      this.createMessageFeed();
      
      // Set up event listeners
      this.setupEventListeners();
    }
    
    createControls() {
      const controlsContainer = document.createElement('div');
      controlsContainer.classList.add('simulator-controls');
      
      // Noise level control
      const noiseControl = document.createElement('div');
      noiseControl.innerHTML = `
        <label for="noise-level">Noise Level: <span id="noise-value">0</span>%</label>
        <input type="range" id="noise-level" min="0" max="100" value="0">
      `;
      
      // Signal strength control
      const signalControl = document.createElement('div');
      signalControl.innerHTML = `
        <label for="signal-strength">Signal Strength: <span id="signal-value">100</span>%</label>
        <input type="range" id="signal-strength" min="0" max="100" value="100">
      `;
      
      // Add message button
      const addTruthBtn = document.createElement('button');
      addTruthBtn.textContent = 'Add Truth Message';
      addTruthBtn.id = 'add-truth';
      
      const addFalseBtn = document.createElement('button');
      addFalseBtn.textContent = 'Add False Message';
      addFalseBtn.id = 'add-false';
      
      const addNoiseBtn = document.createElement('button');
      addNoiseBtn.textContent = 'Generate Noise';
      addNoiseBtn.id = 'add-noise';
      
      // Append to controls container
      controlsContainer.appendChild(noiseControl);
      controlsContainer.appendChild(signalControl);
      controlsContainer.appendChild(addTruthBtn);
      controlsContainer.appendChild(addFalseBtn);
      controlsContainer.appendChild(addNoiseBtn);
      
      // Append to main container
      this.container.appendChild(controlsContainer);
    }
    
    createMessageFeed() {
      const feedContainer = document.createElement('div');
      feedContainer.classList.add('message-feed');
      
      const feedHeader = document.createElement('h3');
      feedHeader.textContent = 'Information Feed';
      
      const messagesList = document.createElement('div');
      messagesList.classList.add('messages-list');
      messagesList.id = 'messages-list';
      
      feedContainer.appendChild(feedHeader);
      feedContainer.appendChild(messagesList);
      
      this.container.appendChild(feedContainer);
    }
    
    setupEventListeners() {
      const noiseSlider = document.getElementById('noise-level');
      const signalSlider = document.getElementById('signal-strength');
      
      noiseSlider.addEventListener('input', (e) => {
        this.noiseLevel = parseInt(e.target.value);
        document.getElementById('noise-value').textContent = this.noiseLevel;
        this.updateFeed();
      });
      
      signalSlider.addEventListener('input', (e) => {
        this.signalStrength = parseInt(e.target.value);
        document.getElementById('signal-value').textContent = this.signalStrength;
        this.updateFeed();
      });
      
      document.getElementById('add-truth').addEventListener('click', () => {
        this.addTruthMessage();
      });
      
      document.getElementById('add-false').addEventListener('click', () => {
        this.addFalseMessage();
      });
      
      document.getElementById('add-noise').addEventListener('click', () => {
        this.generateNoise(5);
      });
    }
    
    addTruthMessage() {
      const truthMessages = [
        "According to scientific studies, vaccines are generally safe and effective.",
        "Global temperatures have risen by approximately 1°C since pre-industrial times.",
        "Exercise has been shown to improve both physical and mental health.",
        "Drinking water helps maintain proper bodily functions.",
        "The Earth orbits the Sun once every 365.25 days approximately."
      ];
      
      const message = {
        id: Date.now(),
        text: truthMessages[Math.floor(Math.random() * truthMessages.length)],
        type: 'truth',
        visibility: this.calculateVisibility('truth')
      };
      
      this.truthMessages.push(message);
      this.messages.unshift(message);
      this.updateFeed();
    }
    
    addFalseMessage() {
      const falseMessages = [
        "Scientists discovered that the Earth is actually flat.",
        "Studies show that eating chocolate prevents all diseases.",
        "New research proves that sleep is unnecessary for human health.",
        "Experts confirm that reading in dim light permanently damages eyesight.",
        "New evidence suggests that drinking coffee stunts your growth permanently."
      ];
      
      const message = {
        id: Date.now(),
        text: falseMessages[Math.floor(Math.random() * falseMessages.length)],
        type: 'false',
        visibility: this.calculateVisibility('false')
      };
      
      this.falseMessages.push(message);
      this.messages.unshift(message);
      this.updateFeed();
    }
    
    generateNoise(count) {
      const noiseMessages = [
        "Celebrity spotted at local restaurant wearing new fashion trend!",
        "You won't BELIEVE what this pet did next! Click to see!",
        "10 amazing life hacks that will change everything!",
        "This one weird trick will save you thousands on insurance!",
        "Top 5 foods you should never eat before bedtime!",
        "Quiz: Which fictional character are you most like?",
        "Breaking: Famous actor considering new role in upcoming film",
        "The shocking truth about your favorite childhood snack!",
        "This everyday household item might be toxic - find out now!"
      ];
      
      for (let i = 0; i < count; i++) {
        const message = {
          id: Date.now() + i,
          text: noiseMessages[Math.floor(Math.random() * noiseMessages.length)],
          type: 'noise',
          visibility: 100 // Noise is always fully visible
        };
        
        this.messages.unshift(message);
      }
      
      this.updateFeed();
    }
    
    calculateVisibility(type) {
      if (type === 'truth') {
        // Truth visibility decreases as noise increases and signal strength decreases
        return Math.max(0, this.signalStrength - (this.noiseLevel / 2));
      } else {
        // False messages become more visible with higher noise
        return Math.min(100, 50 + (this.noiseLevel / 2));
      }
    }
    
    updateFeed() {
      const messagesList = document.getElementById('messages-list');
      messagesList.innerHTML = '';
      
      // Update visibility for all messages
      this.messages.forEach(message => {
        if (message.type === 'truth') {
          message.visibility = this.calculateVisibility('truth');
        } else if (message.type === 'false') {
          message.visibility = this.calculateVisibility('false');
        }
      });
      
      // Display messages in the feed
      this.messages.slice(0, 20).forEach(message => {
        const messageEl = document.createElement('div');
        messageEl.classList.add('message', message.type);
        
        // Apply visibility effect (opacity)
        messageEl.style.opacity = message.visibility / 100;
        
        messageEl.innerHTML = `
          <p>${message.text}</p>
          <span class="message-type">${message.type.toUpperCase()}</span>
        `;
        
        messagesList.appendChild(messageEl);
      });
    }
  }
  
  // Initialize the simulator if the container exists
  document.addEventListener('DOMContentLoaded', () => {
    const simulatorContainer = document.getElementById('disinfo-simulator');
    if (simulatorContainer) {
      new DisinfoSimulator(simulatorContainer);
    }
  });