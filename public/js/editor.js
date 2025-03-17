// استخراج التوكن من الـ URL
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token") || "";

// تحميل Monaco Editor
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });
require(['vs/editor/editor.main'], function() {
    const editor = monaco.editor.create(document.getElementById('editor-container'), {
        value: "// اكتب الكود هنا...",
        language: "javascript",
        theme: "vs-dark",
        automaticLayout: true
    });

    // تغيير لغة المحرر عند اختيار لغة جديدة
    document.getElementById("language-selector").addEventListener("change", function(event) {
        monaco.editor.setModelLanguage(editor.getModel(), event.target.value);
    });

    // إرسال الكود عند الضغط على "تأكيد الكود"
    document.getElementById("submit-code").addEventListener("click", async function() {
        const code = editor.getValue();
        
        if (!token) {
            showToast("الرابط خاطئ أو منتهي الصلاحية ❌️","#52BE4F");
            return;
        }
        try{
           const response = await fetch("/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${token}`
                },
                body: JSON.stringify({ code })
            });
            const data = await response.json();
            showToast(data.msg,data.color);
        }catch(err){
            showToast("شيئ ما خاطئ قد حدث ❌️","#dc3545")
        }
    });
});
function showToast(message,color) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    toastMessage.textContent = message; // Set the message
    toast.style.backgroundColor = color;
    toast.classList.remove('hidden');
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hidden');
    }, 3000); // Hide after 3 seconds (adjust as needed)
}
