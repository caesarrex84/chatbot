using System.Net.Mail;
using System.Net.Mime;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace Ak.Core.Base.Wrappers
{

    public class APITools
    {

        private static String key = "ALT*0123+";
        private static string[] nombresMeses = new string[]
        {
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        };
        private static string[] nombresDiasSemana = new string[]
        {
            "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"
        };

        #region Encriptación 

        /// <summary>
        /// Encripta una cadena de texto utilizando MD5CryptoServiceProvider.
        /// </summary>
        /// <param name="texto"></param>
        /// <returns></returns>
        public static String encrypt(string texto = "")
        {
            if (string.IsNullOrEmpty(texto))
            {
                texto = getRamdomAlphanumericCode(8);
            }

            //arreglo de bytes donde guardaremos la llave
            byte[] keyArray;
            //arreglo de bytes donde guardaremos el texto que vamos a encriptar
            byte[] Arreglo_a_Cifrar = UTF8Encoding.UTF8.GetBytes(texto);

            //Algoritmo MD5
            MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider();
            //se guarda la llave para que se le realice hashing
            keyArray = hashmd5.ComputeHash(UTF8Encoding.UTF8.GetBytes(key));
            hashmd5.Clear();

            //Algoritmo 3DAS
            TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider();

            tdes.Key = keyArray;
            tdes.Mode = CipherMode.ECB;
            tdes.Padding = PaddingMode.PKCS7;

            //se empieza con la transformación de la cadena
            ICryptoTransform cTransform = tdes.CreateEncryptor();

            //arreglo de bytes donde se guarda la
            //cadena cifrada
            byte[] ArrayResultado = cTransform.TransformFinalBlock(Arreglo_a_Cifrar, 0, Arreglo_a_Cifrar.Length);
            tdes.Clear();

            //se regresa el resultado en forma de una cadena
            return Convert.ToBase64String(ArrayResultado, 0, ArrayResultado.Length);
        }

        /// <summary>
        /// Desencripta una cadena de texto utilizando MD5CryptoServiceProvider.
        /// </summary>
        /// <param name="textoEncriptado"></param>
        /// <returns></returns>
        public static String decrypt(string textoEncriptado)
        {
            byte[] keyArray;
            //convierte el texto en una secuencia de bytes
            byte[] Array_a_Descifrar = Convert.FromBase64String(textoEncriptado);

            //algoritmo MD5
            MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider();
            keyArray = hashmd5.ComputeHash(UTF8Encoding.UTF8.GetBytes(key));
            hashmd5.Clear();

            TripleDESCryptoServiceProvider tdes = new TripleDESCryptoServiceProvider();

            tdes.Key = keyArray;
            tdes.Mode = CipherMode.ECB;
            tdes.Padding = PaddingMode.PKCS7;

            ICryptoTransform cTransform = tdes.CreateDecryptor();

            byte[] resultArray = cTransform.TransformFinalBlock(Array_a_Descifrar, 0, Array_a_Descifrar.Length);

            tdes.Clear();
            //se regresa en forma de cadena
            return UTF8Encoding.UTF8.GetString(resultArray);
        }

        /// <summary>
        /// Regresa una cadena de la longitud deseada de caracteres alfanuméricos aleatorios
        /// </summary>
        /// <param name="length"></param>
        /// <returns></returns>
        public static string getRamdomAlphanumericCode(Int32 length)
        {
            String newcode = String.Empty;
            var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var random = new Random();
            newcode = new string(Enumerable.Repeat(chars, length).Select(s => s[random.Next(s.Length)]).ToArray());
            return newcode;
        }

        /// <summary>
        /// Regresa una cadena de la longitud desada de caracteres numéricos aleatorios
        /// </summary>
        /// <param name="length"></param>
        /// <returns></returns>
        public static string getRamdomNumericCode(Int32 length)
        {
            String newcode = String.Empty;
            var chars = "0123456789";
            var random = new Random();
            newcode = new string(Enumerable.Repeat(chars, length).Select(s => s[random.Next(s.Length)]).ToArray());
            return newcode;
        }

        #endregion Encriptación 

        #region Email

        //public static Boolean SendMailAttachment(String To, String Subject, String Body, List<String> attachmentFilename, out String Err)
        //{
        //    string mensaje = String.Empty;
        //    Err = String.Empty;
        //    try
        //    {
        //        #region Debug Mail
        //        ParameterManagement PM = new ParameterManagement();
        //        Boolean EmailDebug = PM.getParamValueByName("EmailDebug", false);
        //        if (EmailDebug)
        //        {
        //            To = PM.getParamValueByName("EmailDebugMail");
        //            Subject = "AKTIEN - Dev Mail: " + Subject;
        //        }
        //        #endregion
        //        SmtpSection section = (SmtpSection)ConfigurationManager.GetSection("system.net/mailSettings/smtp");
        //        #region Images as Resources
        //        List<string> imgs = new List<string>();
        //        foreach (Match m in Regex.Matches(Body, "<img.+?src=[\"'](.+?)[\"'].+?>", RegexOptions.IgnoreCase | RegexOptions.Multiline))
        //        {
        //            imgs.Add(m.Groups[1].Value);
        //        }

        //        string[] sources = imgs.ToArray();
        //        LinkedResource[] LinkedResources = new LinkedResource[imgs.Count];
        //        for (int i = 0; i < imgs.Count; i++)
        //        {
        //            sources[i] = imgs[i];
        //            sources[i] = sources[i].Substring(sources[i].IndexOf("data"), sources[i].Length - sources[i].IndexOf("data"));
        //            //sources[i] = sources[i].Substring(0, sources[i].IndexOf("\"") - 1);
        //        }
        //        ContentType c = new ContentType("image/jpeg");
        //        for (int i = 0; i < imgs.Count; i++)
        //        {
        //            System.Net.Mime.ContentType ct = new ContentType();
        //            Body = Body.Replace(sources[i], ("cid:" + i));
        //            sources[i] = sources[i].Replace("data:image/jpeg;base64,", "");
        //            ct.MediaType = "image/jpeg";
        //            if (sources[i].Contains("image/png"))
        //            {
        //                sources[i] = sources[i].Replace("data:image/png;base64,", "");
        //                ct.MediaType = "image/png";
        //            }

        //            byte[] imageBytes = System.Convert.FromBase64String(sources[i]);

        //            LinkedResources[i] = new LinkedResource(new MemoryStream(imageBytes));
        //            LinkedResources[i].ContentType = c;
        //            LinkedResources[i].ContentId = i.ToString();
        //            LinkedResources[i].TransferEncoding = TransferEncoding.Base64;
        //            LinkedResources[i].ContentType = ct;

        //        }
        //        #endregion
        //        MailMessage message = new MailMessage(section.From, To, Subject, Body);
        //        if (attachmentFilename != null && attachmentFilename.Count > 0)
        //        {
        //            string sFolder = AppDomain.CurrentDomain.BaseDirectory;
        //            foreach (String str in attachmentFilename)
        //            {
        //                String ruta = sFolder + str;
        //                if (File.Exists(ruta))
        //                {
        //                    Attachment attachment = new Attachment(ruta);
        //                    attachment.NameEncoding = Encoding.UTF8;
        //                    ContentDisposition disposition = attachment.ContentDisposition;
        //                    disposition.CreationDate = File.GetCreationTime(ruta);
        //                    disposition.ModificationDate = File.GetLastWriteTime(ruta);
        //                    disposition.ReadDate = File.GetLastAccessTime(ruta);
        //                    disposition.FileName = Path.GetFileName(ruta);
        //                    disposition.Size = new FileInfo(ruta).Length;
        //                    disposition.DispositionType = DispositionTypeNames.Attachment;
        //                    message.Attachments.Add(attachment);
        //                }
        //            }
        //        }
        //        #region Images as Resources - AlternateView 
        //        AlternateView alternativeView = AlternateView.CreateAlternateViewFromString(Body, null, MediaTypeNames.Text.Html);
        //        alternativeView.ContentId = "htmlView";
        //        alternativeView.TransferEncoding = TransferEncoding.SevenBit;
        //        for (int i = 0; i < imgs.Count; i++)
        //        {
        //            alternativeView.LinkedResources.Add(LinkedResources[i]);
        //        }
        //        message.AlternateViews.Add(alternativeView);
        //        #endregion
        //        message.IsBodyHtml = true;
        //        message.HeadersEncoding = Encoding.UTF8;
        //        message.BodyEncoding = Encoding.UTF8;
        //        SmtpClient emailClient = new SmtpClient(section.Network.Host, section.Network.Port);
        //        NetworkCredential SMTPUserInfo = new NetworkCredential(section.Network.UserName, section.Network.Password);
        //        emailClient.UseDefaultCredentials = section.Network.DefaultCredentials;
        //        emailClient.EnableSsl = section.Network.EnableSsl;
        //        if (section.Network.EnableSsl)
        //            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
        //        emailClient.Credentials = SMTPUserInfo;
        //        emailClient.Send(message);
        //        return true;
        //    }
        //    catch (Exception ex)
        //    {
        //        String detail = "Ocurrió un error al enviar el correo a: " + To + "; para el tema de: " + Subject;
        //        new AppManagement().Log(ex, detail, "UImanagement.cs - SendMail");
        //        Err = ex.Message;
        //        return false;
        //    }
        //}

        //public static Boolean SendMail(String To, String Subject, String Body, List<String> attachmentFilename, out String Err)
        //{
        //    return SendMailAttachment(To, Subject, Body, attachmentFilename, out Err);
        //}

        public static String BuildEmail(String path, String TEXT)
        {
            StringBuilder sb = new StringBuilder();
            try
            {
                StringBuilder sbCSS = new StringBuilder();

                #region Construcción de Correo

                String[] lines = System.IO.File.ReadAllLines(path + "App_Aktien/EmailTemplates/AktienMail.html");
                StringBuilder sbBase = new StringBuilder();
                foreach (String line in lines)
                    sbBase.Append(line);
                String BASE = sbBase.ToString();

                String correoUser = BASE.Replace("#TEXT", TEXT);

                #endregion Construcción de Correo

                return correoUser;
            }
            catch
            {

            }
            return sb.ToString();
        }


        #endregion

        #region TextTools

        public static String monthName(int mont)
        {
            string nombreMes = string.Empty;
            if (mont < 1 || mont > 12)
            {
                nombreMes = "Error en indice";
            }
            else
            { 
                nombreMes = nombresMeses[mont - 1];
            }

            return nombreMes;
        }
        public static String dayOfWeek(int day)
        {
            string nombreDiaSemana = String.Empty;

            if (day < 1 || day > 7)
            {
                nombreDiaSemana = "Error de indice";
            }
            else
            {
                nombreDiaSemana = nombresDiasSemana[day - 1];
            }

            return nombreDiaSemana;

        }

        #endregion

    }

}
