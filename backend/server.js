const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the required files for universal links
app.use('/.well-known', express.static(path.join(__dirname, '.well-known')));

// Serve apple-app-site-association
app.get("/.well-known/apple-app-site-association", (req, res) => { 
    res.sendFile(path.join(__dirname, ".well-known/apple-app-site-association")); 
});

// Serve assetlinks.json for Android
app.get("/.well-known/assetlinks.json", (req, res) => {
    res.sendFile(path.join(__dirname, ".well-known/assetlinks.json"));
});

// Handle ALL routes - redirect to app or store
app.get("*", (req, res) => {
    const userAgent = req.headers["user-agent"] || "";
    const isAndroid = /Android/.test(userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);

    // App deep link (change 'myapp' to your app scheme)
    const appDeepLink = "myapp://" + (req.path !== "/" ? req.path : "home");
    
    // Store URLs
    const playStoreUrl = "https://play.google.com/store/apps/details?id=com.appname";
    const appStoreUrl = "https://apps.apple.com/app/idXXXXXXXXX";

    // Simple HTML that tries to open app, then redirects to store
    const html = `
    <html>
        <head>
            <title>Redirecting to App</title>
        </head>
        <body>
            <script>
                // Try to open the app first
                window.location.href = "${appDeepLink}";
                
                // If app isn't installed, redirect to store after 1 second
                setTimeout(function() {
                    if (${isAndroid}) {
                        window.location.href = "${playStoreUrl}";
                    } else if (${isIOS}) {
                        window.location.href = "${appStoreUrl}";
                    } else {
                        window.location.href = "${playStoreUrl}"; // desktop fallback
                    }
                }, 1000);
            </script>
            <p>Opening app...</p>
        </body>
    </html>
    `;

    res.send(html);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 