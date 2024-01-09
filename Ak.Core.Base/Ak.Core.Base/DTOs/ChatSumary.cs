using Ak.Core.Base.Entities;

namespace Ak.Core.Base.DTOs
{

    public class ChatSumary
    {
        public ChatSumary()
        {

        }

        public ChatSumary(ChatToken chatToken)
        {
            this.id = chatToken.Id;
            this.ChatToken = chatToken.Token;
            this.ChatDate = chatToken.FechaCreacion;
            this.Name = chatToken.Nombre;
            this.Phone = chatToken.Telefono;
            this.Email = chatToken.Correo;

            this.AditionalData = !chatToken.ChatTokenDatos.Any() ? new List<ChatInfo>() :
                chatToken.ChatTokenDatos.Select(x => new ChatInfo()
                {
                    Label = x.Etiqueta,
                    Data = x.Dato,
                }).ToList();
            this.Conversation = !chatToken.ChatTokenPregunta.Any() ? new List<ChatInfo>() :
                chatToken.ChatTokenPregunta.Select(x => new ChatInfo()
                {
                    Label = x.Pregunta,
                    Data = x.Respuesta,
                }).ToList();
        }

        public Int32 id { get; set; }
        public String ChatToken { get; set; } = String.Empty;
        public DateTime ChatDate { get; set; }
        public String? Name { get; set; } = String.Empty;
        public String? Phone { get; set; } = String.Empty;
        public String? Email { get; set; } = String.Empty;
        public List<ChatInfo> AditionalData { get; set; } = new List<ChatInfo> { };
        public List<ChatInfo> Conversation { get; set; } = new List<ChatInfo> { };
    }

    public class ChatInfo
    {
        public String Data { get; set; } = String.Empty;
        public String Label { get; set; } = String.Empty;
    }
}
