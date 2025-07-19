console.log('Popup script loaded');

// Wait for the DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM is loaded');
    
    // Get the buttons if they exist (save key and summarize)
    const saveButton = document.getElementById('save-api-key');
    const summarizeButton = document.getElementById('summarize');
    
    // Add click listeners the buttons
    if (saveButton) {
        saveButton.addEventListener('click', async () => {
            console.log('Save button clicked');
            const apiKey = document.getElementById('api-key').value;
            console.log('API key value:', apiKey ? 'exists' : 'empty');
            
            if (!apiKey) {
                alert('Please enter an API key');
                return;
            }

            try {
                await chrome.storage.local.set({ 'openai_api_key': apiKey });
                console.log('API key saved successfully');
                document.getElementById('api-key-container').style.display = 'none';
                document.getElementById('api-key').value = '';
                alert('API key saved');
            } catch (error) {
                console.error('Error saving API key:', error);
                alert('Error saving API key');
            }
        });
    }
    
    if (summarizeButton) {
        summarizeButton.addEventListener('click', async () => {
            console.log('Summarize button clicked');
            try {
                // First check if we have an API key
                const data = await chrome.storage.local.get('openai_api_key');
                console.log('API key exists:', !!data.openai_api_key);
                
                if (!data.openai_api_key) {
                    throw new Error('Please save your OpenAI API key first');
                }

                const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
                console.log('Active tab:', tab ? 'found' : 'not found');
                
                if (!tab) {
                    throw new Error('No active tab found');
                }
                
                const response = await chrome.tabs.sendMessage(tab.id, {action: "getText"});
                console.log('Got text from page:', !!response.text);
                
                const url = 'https://api.openai.com/v1/chat/completions';
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.openai_api_key}`
                };
                const requestBody = {
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "You are a helpful assistant that summarizes text. Summarize the following text into 5 sentences, ignoring any boilerplate text that is irrelevant to the main content: " + response.text
                        }
                    ],
                    max_tokens: 500
                }
                const LLMResponse = await fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(requestBody)
                })
                console.log('Status:', LLMResponse.status);
                console.log('Headers:', LLMResponse.headers);

                const LLMData = await LLMResponse.json();
                console.log('LLM response:', LLMData);
                if (LLMData.error) {
                    console.error('OpenAI error:', LLMData.error);
                    throw new Error(LLMData.error.message);
                }
                if (!LLMData.choices || LLMData.choices.length === 0) {
                    console.error('No choices in response:', LLMData);
                    throw new Error('No response from OpenAI');
                }
                const summary = LLMData.choices[0].message.content;
                
                const summaryElement = document.getElementById('summary');
                summaryElement.textContent = summary;
            } catch (error) {
                console.error('Error:', error);
                const summary = document.getElementById('summary');
                summary.textContent = error.message;
            }
        });
    }

    // Check if API key exists on load
    chrome.storage.local.get('openai_api_key', (data) => {
        console.log('Checking for existing API key:', !!data.openai_api_key);
        if (data.openai_api_key) {
            document.getElementById('api-key-container').style.display = 'none';
        }
    });
});