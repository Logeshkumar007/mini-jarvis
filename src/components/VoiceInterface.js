import { useEffect, useState } from "react";
import { Button, Typography, Container, Box, Paper, CircularProgress } from "@mui/material";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { getChatGptResponse } from "./GptResponse";

const VoiceInterface = () => {
  const [voiceOn, setVoiceOn] = useState(true);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const { transcript, resetTranscript } = useSpeechRecognition();

  const handleClick = () => {
    setVoiceOn(true);
    SpeechRecognition.startListening({ continuous: true });
  };

  const handleStop = () => {
    setVoiceOn(false);
    SpeechRecognition.stopListening();
  };

  const handleTextRecognized = async (text) => {
    if (text) {
      setLoading(true);
      const gptResponse = await getChatGptResponse(text);
      setResponse(gptResponse);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleClick();
  }, []);

  useEffect(() => {
    const lower = transcript.toLowerCase();
    if (lower.includes("stop listening")) {
      handleStop();
      resetTranscript();
    } else if (lower.includes("hey buddy")) {
      handleClick();
      resetTranscript();
    } else if (lower.includes("search this")) {
      handleTextRecognized(lower.replace("search this", "").trim());
      resetTranscript();
    }
  }, [transcript]);

  return (
    <Box
      sx={{
        bgcolor: "#121212",
        minHeight:"95dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
      }}
    >
      {!voiceOn && (
        <Button
          variant="contained"
          sx={{
            backgroundColor: "white",
            color: "black",
            mt: 2,
            "&:hover": {
              backgroundColor: "#f7f7f7",
              border: "solid 1px white",
            },
          }}
          onClick={handleClick}
        >
          Start Listening
        </Button>
      )}

      <Paper
        elevation={3}
        sx={{
          bgcolor: "#1e1e1e",
          color: "white",
          p: 3,
          mt: 4,
          width: "100%",
          maxWidth: "600px",
        }}
      >
        <Typography variant="h6" gutterBottom>
          🎙️ Transcript:
        </Typography>
       <Typography variant="body1" sx={{ wordWrap: "break-word" }}>
  {voiceOn ? (transcript || "Listening...") : "Start Listening by clicking button..."}
</Typography>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          bgcolor: "#1e1e1e",
          color: "white",
          p: 3,
          mt: 3,
          width: "100%",
          maxWidth: "600px",
          minHeight: "100px",
        }}
      >
        <Typography variant="h6" gutterBottom> 
          🤖  Response:
        </Typography>
        {loading ? (
          <CircularProgress sx={{ color: "white" }} />
        ) : (
          <Typography variant="body1" sx={{ wordWrap: "break-word" }}>
            {response || "Say 'search this ...' to get a response."}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default VoiceInterface;
