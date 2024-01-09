namespace Ak.Core.Base.DTOs
{
    public class ChatBotResponse
    {
        public ChatBotResponse(string message)
        {
            Message = message;
        }

        public ChatBotResponse()
        {
            Message = string.Empty;
        }

        public string Message { get; set; } = string.Empty;
    }

    public class ChatBotRequest
    {
        public ChatBotRequest(string prompt, List<OldMessage> oldMessages)
        {
            ChatToken = string.Empty;
            Prompt = prompt;
            OldMessages = oldMessages;
        }

        public ChatBotRequest()
        {
            ChatToken = string.Empty;
            Prompt = string.Empty;
            OldMessages = new List<OldMessage>();
        }

        public string ChatToken { get; set; } = string.Empty;
        public string Prompt { get; set; } = string.Empty;
        public List<OldMessage> OldMessages { get; set; } = new List<OldMessage>();
    }

    public class OldMessage
    {
        public OldMessage(string question, string answer)
        {
            Question = question;
            Answer = answer;
        }
        public OldMessage()
        {
            this.Question = string.Empty;
            this.Answer = string.Empty;
        }

        public String Question { get; set; } = string.Empty;
        public String Answer { get; set; } = String.Empty;
    }

}

