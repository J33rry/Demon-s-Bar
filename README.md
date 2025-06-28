# Demon's Bar

A full-stack web application for real-time communication and social interaction. Built using **React**, **Tailwind CSS**, **Node.js**, **Express**, and **MongoDB**, this app supports user authentication, real-time messaging via **WebSockets**, and customizable theming with **DaisyUI**.

## 🚀 Tech Stack

**Frontend**  
- React  
- Tailwind CSS  
- DaisyUI (for themes)

**Backend**  
- Node.js  
- Express  
- MongoDB  
- WebSockets (socket.io)

**Other Tools**  
- Cloudinary (for image uploads)  
- Render (for deployment)



## 🔐 Features

- ✅ User Authentication (Register/Login)
- 🧑‍🎨 Upload user profile pictures via Cloudinary
- 💬 Real-time messaging using Socket.io
- 🎨 Theme switching via DaisyUI
- 📱 Fully responsive design
- 🌐 Deployed on [Render] ([DemonS_Bar](https://demon-s-bar.onrender.com/login))

## 📁 Project Structure

```bash
Demon-s-Bar/
├── Front/        # React frontend with Tailwind + DaisyUI
└── Back/         # Node.js backend with Express, MongoDB & WebSockets
```

## 🛠️ Installation

### Clone the repository
```bash
git clone https://github.com/J33rry/Demon-s-Bar.git
cd Demon-s-Bar
```

### Frontend Setup
```bash
cd Front
npm install
npm run dev
```

### Backend Setup
```bash
cd ../Back
npm install
npm run dev
```

> Configure your `.env` file in the `Back/` folder with your MongoDB URI, Cloudinary credentials, and JWT secret.

## 🌐 Deployment

- Frontend hosted on **Render**
- Backend API and WebSocket server also deployed via **Render**
- Assets (e.g. profile pictures) hosted on **Cloudinary**

## 📸 Screenshots
<img width="600" alt="Screenshot 2025-06-28 at 8 11 28 AM" src="https://github.com/user-attachments/assets/4d0105ad-be1d-4ae0-b580-0226370689a4" /><img width="600" alt="Screenshot 2025-06-28 at 8 12 33 AM" src="https://github.com/user-attachments/assets/43065844-0142-4141-b6b2-ecb0853e7534" />
<img width="600" alt="Screenshot 2025-06-28 at 8 12 52 AM" src="https://github.com/user-attachments/assets/e8edafcf-7ea7-4402-9d64-7d4222096b7f" /><img width="600" alt="Screenshot 2025-06-28 at 8 13 05 AM" src="https://github.com/user-attachments/assets/e6a05cec-f7a3-4f03-a1b2-f4039dbbb832" />

## 📄 License


This project is licensed under the MIT License.

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📬 Contact

Reach out at [notaboutjerry@gmail.com] or open an issue on GitHub.
