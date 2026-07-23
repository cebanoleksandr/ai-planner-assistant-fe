import { useState, useRef, useEffect } from 'react';
import { 
  Box, Paper, Typography, IconButton, TextField, CircularProgress, Divider 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { motion, AnimatePresence } from 'framer-motion';
import { useSendChatMessage } from '../../../reactQuery/hooks/useChat';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

interface ChatWidgetProps {
  open: boolean;
  onClose: () => void;
}

export const ChatWidget = ({ open, onClose }: ChatWidgetProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'ai', text: "Hi! I'm your AI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { mutate, isPending } = useSendChatMessage();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPending]);

  const handleSend = () => {
    if (!input.trim() || isPending) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    
    const currentInput = input.trim();
    setInput('');

    mutate(currentInput, {
      onSuccess: (response) => {
        console.log("RESPONSE: ", response)
        const aiText = response || response?.text || response?.message || 'Готово!';
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', text: aiText }]);
      },
      onError: () => {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', text: 'A connection error occurred.' }]);
      }
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            bottom: 90,
            right: 24,
            zIndex: 1400,
          }}
        >
          <Paper
            elevation={12}
            sx={{
              width: 380,
              height: 550,
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            {/* Header */}
            <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AutoAwesomeIcon fontSize="small" />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>AI Planner Assistant</Typography>
              </Box>
              <IconButton size="small" onClick={onClose} sx={{ color: 'white' }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Messages Area */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, bgcolor: 'grey.50', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Box sx={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    <Box sx={{
                      maxWidth: '80%',
                      p: 1.5,
                      borderRadius: 3,
                      bgcolor: msg.role === 'user' ? 'primary.main' : 'background.paper',
                      color: msg.role === 'user' ? 'primary.contrastText' : 'text.primary',
                      boxShadow: 1,
                    }}>
                      <Typography variant="body2">{msg.text}</Typography>
                    </Box>
                  </Box>
                </motion.div>
              ))}
              {isPending && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <CircularProgress size={20} />
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Input Area */}
            <Divider />
            <Box sx={{ p: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Write a command..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                disabled={isPending}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
              <IconButton color="primary" onClick={handleSend} disabled={!input.trim() || isPending}>
                <SendIcon />
              </IconButton>
            </Box>
          </Paper>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
