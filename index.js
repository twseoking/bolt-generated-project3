const openai = require('openai');
    
    async function chatWithGPT(prompt, apiKey) {
      try {
        const client = new openai.Client({
          apiKey: apiKey,
          dangerouslyAllowBrowser: true
        });

        const completion = await client.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }]
        });
        
        return completion.choices[0].message.content;
      } catch (error) {
        console.error('Error:', error.message);
        return null;
      }
    }

    // 主程序
    async function main() {
      console.log('\nOpenAI Chat Robot\n');
      
      // 获取用户输入的API密钥
      const apiKey = await new Promise((resolve) => {
        process.stdin.resume();
        process.stdin.on('data', (chunk) => {
          const key = chunk.toString().trim();
          resolve(key);
        });
      });

      console.log('\n请输入你的问题，按Ctrl+C退出:');
      
      while(true) {
        try {
          const prompt = await new Promise((resolve) => {
            process.stdin.resume();
            process.stdin.on('data', (chunk) => {
              const input = chunk.toString().trim();
              resolve(input);
            });
          });

          if (!prompt) break;

          console.log('\n思考中...');
          const response = await chatWithGPT(prompt, apiKey);
          
          if (response) {
            console.log('\nChatGPT:', response);
          }
        } catch (error) {
          console.error('Error:', error.message);
        }
      }

      console.log('\n退出程序。');
    }

    main();
