# Pharmacy Inhaler Assistant

A Next.js web application that interfaces with Azure OpenAI Assistant to provide pharmacy inhaler formulary information.

## Features

- Insurance provider selection
- Medication preference options (Generic/Brand)
- Medication class selection
- Chat interface with Azure OpenAI Assistant
- Responsive design with Tailwind CSS

## Project Structure

```
pharmacy-inhaler-assistant/
├── src/
│   ├── app/
│   │   ├── page.tsx                # Main application page
│   │   ├── layout.tsx              # Root layout
│   │   ├── globals.css             # Global styles
│   │   └── api/
│   │       ├── chat/
│   │       │   ├── route.ts        # Chat API endpoint
│   │       │   └── thread/
│   │       │       └── route.ts    # Thread creation endpoint
│   ├── components/
│   │   ├── Chat.tsx                # Chat interface component
│   │   └── InsuranceForm.tsx       # Insurance form component
├── .env.local.example              # Example environment variables
├── package.json                    # Project dependencies
└── README.md                       # Project documentation
```

## Setup Instructions

1. **Clone the repository**

2. **Install dependencies**
   ```bash
   cd pharmacy-inhaler-assistant
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.local.example` to `.env.local`
   - Add your Azure OpenAI credentials:
     ```
     AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com/
     AZURE_OPENAI_API_KEY=your-azure-openai-api-key
     AZURE_ASSISTANT_ID=your-azure-assistant-id
     ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## Testing

Test the application by:

1. Selecting an insurance provider, preference, and medication class
2. Submitting the form to start a chat session
3. Asking questions about formulary coverage, costs, or alternatives
4. Verifying that responses are contextual to your selections

## Deployment to Vercel

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/pharmacy-inhaler-assistant.git
   git push -u origin main
   ```

2. **Import your project to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure the project settings

3. **Add environment variables**
   - In the Vercel project settings, add the same environment variables from your `.env.local` file

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - Once complete, you'll receive a URL for your deployed application

## Customization

- **Styling**: Modify `globals.css` and component styles to match your brand
- **Form Options**: Update the insurance providers, preferences, and medication classes in `InsuranceForm.tsx`
- **Response Logic**: Enhance the response generation in `api/chat/route.ts`
