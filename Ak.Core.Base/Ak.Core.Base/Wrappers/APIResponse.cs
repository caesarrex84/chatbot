namespace Ak.Core.Base.Wrappers
{
    public class APIResponse<T>
    {
        public APIResponse()
        {
            Message = "";
            Errors = new List<string>();
        }
        public APIResponse(T data, string? message = null)
        {
            Succeded = true;
            Message = message;
            Data = data;
            Errors = new List<string>();
        }

        public APIResponse(string? message = null)
        {
            Succeded = false;
            Message = message;
        }

        public bool Succeded { get; set; } = false;
        public string? Message { get; set; }
        public string? Exception { get; set; }
        public List<string>? Errors { get; set; }
        public T? Data { get; set; }
        public string? JWToken { get; set; }
    }
}
