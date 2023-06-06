import ForgeUI, { render, Fragment, Text, Button, useState, useEffect, useProductContext } from '@forge/ui';
import api, { route } from "@forge/api";

const fetchIssueDescription = async (issueKey) => {
  const response = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}`);
  
  if (!response.ok) {
    const message = `Error fetching issue ${issueKey}: ${response.status} ${response.statusText}`;
    console.error(message);
    throw new Error(message);
  }

  const issueData = await response.json();
  return issueData.fields.description;
};

const App = () => {
  const { extensionContext: { issueKey } } = useProductContext();
  const [description, setDescription] = useState('Loading...');
  const [generatedText, setGeneratedText] = useState(null);

  useEffect(() => {
    fetchIssueDescription(issueKey).then(setDescription);
  }, [issueKey]);

  const handleClick = async () => {
    // replace with your actual OpenAI API key
    const openAIKey = 'YOUR_OPENAI_KEY';

    const prompt = `${description}...`;

    const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIKey}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: 60,
      }),
    });

    const data = await response.json();
    setGeneratedText(data.choices[0].text);
  };

  return (
    <Fragment>
      <Text>Description: {description}</Text>
      <Button text="Generate Text" onClick={handleClick} />
      {generatedText && <Text>Generated Text: {generatedText}</Text>}
    </Fragment>
  );
};

export const run = render(<App />);
