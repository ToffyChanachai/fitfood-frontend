# เลือก base image สำหรับ Node.js
FROM node:18-alpine

# ตั้งค่า working directory ภายใน container
WORKDIR /app

# คัดลอกไฟล์ package.json และ package-lock.json หรือ yarn.lock
COPY package*.json ./

# ติดตั้ง dependencies ที่โปรเจ็กต์ Vue.js ต้องการ
RUN npm install

# คัดลอกไฟล์โปรเจ็กต์ทั้งหมดไปยัง container
COPY . .

# สร้างโปรเจ็กต์ Vue.js
RUN npm run build

# เปิดพอร์ตที่แอปจะฟัง
EXPOSE $PORT

# รันคำสั่งที่กำหนดใน package.json (ใช้ 'start' เพื่อรันแอปที่ build แล้ว)
CMD ["npm", "run", "start"]
