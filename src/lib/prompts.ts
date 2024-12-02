// 1. Spelling Mistakes
export const spellingMistakesPrompt = (rawText: string) => `
    Please check for spelling mistakes in the following Raw Text: "${rawText}".
    If all spellings are correct, return "spellingMistakes": []. Otherwise, return 
    the incorrect words and their corrections in JSON format as per the following schema:

    {
      "spellingMistakes": [
        { "incorrect": "[incorrectWord]", "correct": "[correctWord]" }
      ]
    }
    
    Example response:
    {
      "spellingMistakes": [
        { "incorrect": "Appl", "correct": "Apple" },
        { "incorrect": "Bananna", "correct": "Banana" }
      ]
    }
    NOTE: Respond only in JSON format. Do not nest any additional objects within "spellingMistakes".
`;

// 2. Keyword Match
export const matchedAndSuggestedKeywordPrompt = (jobDescription: string, rawText: string) => `
    Please analyze the following Job Description: "${jobDescription}" and Raw Text: "${rawText}".
    Identify keywords that match between both texts, and suggest any essential keywords that are missing.
    
    Return the result in JSON format as per the schema:

    {
      "matchedKeywords": [
        "[keyword1]", "[keyword2]"
      ],
      "suggestedKeywords": [
        "[suggestedKeyword1]", "[suggestedKeyword2]"
      ]
    }

    Example response:
    {
      "matchedKeywords": ["keyword1", "keyword2", "keyword3"],
      "suggestedKeywords": ["suggestedKeyword1", "suggestedKeyword2"]
    }
    NOTE: Respond only in JSON format without any additional nesting inside "matchedKeywords" or "suggestedKeywords".
`;

// 3. Skillset Analysis
export const skillSetAnalysisPrompt = (jobDescription: string, rawText: string) => `
    Compare the skillset between the following job description and raw text.
    Provide a point-form list of skillset suggestions and advice.

    Job Description: "${jobDescription}"
    Raw Text: "${rawText}"

    Return the response in JSON format as per the following schema:

    {
      "skillSetAnalysis": [
        "[suggestion1]", "[suggestion2]"
      ]
    }

    Example response:
    {
      "skillSetAnalysis": [
        "Consider highlighting proficiency in X technology.",
        "Add examples of teamwork in Y scenario."
      ]
    }
    NOTE: Respond only in JSON format without nesting any additional objects inside "skillSetAnalysis".
`;

// 4. Helpful Insights
export const helpfulInsightsPrompt = (jobDescription: string, rawText: string) => `
    Compare the sentiment and key phrases between the following job description and raw text.
    Provide helpful insights in JSON format according to this schema:

    {
      "helpfulInsights": {
        "sentimentComparison": ["difference 1", "difference 2"],
        "matchedPhrases": ["matched phrase 1", "matched phrase 2"],
        "suggestedPhrases": ["suggested phrase 1", "suggested phrase 2"]
      }
    }

    Job Description: "${jobDescription}"
    Raw Text: "${rawText}"

    Example response:
    {
      "helpfulInsights": {
        "sentimentComparison": ["The job description has a more positive tone."],
        "matchedPhrases": ["Customer service","Team leadership","Collaboration"],
        "suggestedPhrases": ["Strong communication skills"]
      }
    }
    NOTE: Respond only in JSON format with a single-level "helpfulInsights" object. Avoid additional nesting.
`;

// 5. Combined Score 
export const combinedScorePrompt = (jobDescription: string, rawText: string) => `
    Calculate percentile scores (out of 100%) based on a comparison between the job description and the raw text. Return the scores and suggested improvements in JSON format as per the schema:

    {
      "combinedScore": {
        "keywordMatchScore": "[score]%",
        "skillsetMatchScore": "[score]%",
        "overallScore": "[score]%",
        "suggestedImprovements": [
          "[improvement1]", "[improvement2]"
        ]
      }
    }

    Job Description: "${jobDescription}"
    Raw Text: "${rawText}"

    Example response:
    {
      "combinedScore": {
        "keywordMatchScore": "95%",
        "skillsetMatchScore": "85%",
        "overallScore": "90%",
        "suggestedImprovements": [
          "Emphasize project management experience.",
          "Add leadership skills relevant to X role."
        ]
      }
    }
    NOTE: Respond only in JSON format without nesting any additional objects inside "combinedScore".
`;

// 6. Generate Quiz
export const generateQuizPrompt = (jobDescription: string) => `
    Please read the following job description: "${jobDescription}", understand the role and required technical skills, and create a quiz accordingly.
    The quiz should assess the *technical skills* and knowledge relevant to the role, including programming, software tools, problem-solving techniques, or industry-specific knowledge explicitly mentioned in the job description.

    **Guidelines**:
    - Focus questions on technical skills (e.g., coding, system design, software usage) and knowledge relevant to the role.
    - Include code-related questions in the main programming language(s) mentioned in the job description, such as JavaScript, Python, SQL, etc.
    - Format code snippets in Markdown code blocks with the appropriate language automatically chosen based on the job description.
    - Avoid questions on generic or soft skills unless they are clearly tied to specific technical tasks.

    **Question Requirements**:
    - Each question should be unique and directly relevant to the skill set in the job description.
    - Format each question as multiple-choice with 4 options.
    - Each question should have only one correct answer, along with a brief explanation.
    - Include 5 questions in total, with at least 3 containing code snippets in the relevant language(s).

    Return the quiz in JSON format, using this schema:
    [
        {
            "question": "[Question 1]",
            "options": {
                "a": "[Option 1]",
                "b": "[Option 2]",
                "c": "[Option 3]",
                "d": "[Option 4]"
            },
            "correctOption": "[Correct Option]",
            "explanation": "[Explanation]"
        },
        // additional questions...
    ]
    
    **Example response with dynamic language**:
    [
        {
            "question": "What will be the output of the following code?
                const a = [1, 2, 3];
                console.log(a.map(x => x * 2));
            ",
            "options": {
                "a": "[2, 4, 6]",
                "b": "[1, 2, 3]",
                "c": "undefined",
                "d": "Error"
            },
            "correctOption": "a",
            "explanation": "The map function iterates over each element in the array and multiplies it by 2, resulting in [2, 4, 6]."
        },
        {
            "question": "Which of the following is a characteristic of a binary search algorithm?",
            "options": {
                "a": "O(n) time complexity",
                "b": "O(log n) time complexity",
                "c": "O(n^2) time complexity",
                "d": "O(1) time complexity"
            },
            "correctOption": "b",
            "explanation": "Binary search has a time complexity of O(log n) because it divides the search space in half each iteration."
        }
    ]
`;