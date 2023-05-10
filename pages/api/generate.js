import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const type = req.body.type || '';
  if (type.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid type",
      }
    });
    return;
  }

  const speciality = req.body.speciality || '';
  if (speciality.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid speciality",
      }
    });
    return;
  }

  const topic = req.body.topic || '';
  if (topic.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid topic",
      }
    });
    return;
  }

  const requirements = req.body.requirements || '';
  if (requirements.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid requirements",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(type, speciality, topic, requirements),
      temperature: 1,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      // stop: ["\n"]
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(type, speciality, topic, requirements) {
  const capitalizedType =
    type[0].toUpperCase() + type.slice(1).toLowerCase();
  const capitalizedSpeciality =
    speciality[0].toUpperCase() + speciality.slice(1).toLowerCase();
  const capitalizedTopic =
    topic[0].toUpperCase() + topic.slice(1).toLowerCase();
  const capitalizedRequirements =
    requirements[0].toUpperCase() + requirements.slice(1).toLowerCase();
  return `Compose ${capitalizedType} on the subject of "${capitalizedTopic}" that adheres to the principles of proper organization and thoroughness.
  This written work should be tailored to the ${capitalizedSpeciality} field and must satisfy the requirements: ${capitalizedRequirements}.`;
}
