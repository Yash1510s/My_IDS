# Intrusion Detection System (IDS) Project Report

## 1. Introduction
The rising number of cybersecurity threats has necessitated the development of advanced Intrusion Detection Systems (IDS). This project aims to build a robust, machine-learning-based IDS capable of accurately detecting network intrusions, classifying different attack vectors, and actively simulating adversarial attacks. It integrates a sophisticated Machine Learning backend with a highly interactive Frontend for real-time traffic visualization and control.

## 2. System Architecture
The application architecture is divided into two major components:
- **Backend (Python & Flask)**: Hosts the trained Machine Learning model (Random Forest) for predicting network packets. It processes the traffic statistics and makes split-second decisions on whether a packet is generic/benign or malicious.
- **Frontend (React, TypeScript & Vite)**: Provides a visually stunning, real-time interface. It leverages modern web technologies to stream packet data, display 3D network topologies, and offer comprehensive analytics (ROC curves, confusion matrices) to the end user.

## 3. Dataset & Model
### 3.1. Dataset
The model was trained on the `CICIDS2017` dataset, which contains benign and the most up-to-date common attacks, closely resembling real-world data (PCAPs).
### 3.2. Machine Learning Algorithm
The core prediction engine uses a **Random Forest Classifier**. This ensemble algorithm is highly suitable for unstructured data and is resistant to overfitting, providing excellent precision and recall out of the box.

## 4. Key Features Implemented
1. **Real-Time Network Simulation**: Visualizes packet flow with animated metrics predicting real-time attack probabilities.
2. **Adversarial Attack Simulation**: Uses simulated techniques (like HopSkipJump) to try and evade the IDS, providing users insight into how ML models can be fooled.
3. **Analytics Dashboard**: Tracks ROC curves, detection rates, false positive rates, and response times in real time.
4. **Interactive Network Topology**: A fully functional 2D/3D structure demonstrating how nodes connect and where attacks originate.
5. **Data Exporting**: All findings and metrics can be exported seamlessly into comprehensive reports.

## 5. Performance Metrics
The system was evaluated using standard classification metrics:
- **Detection Rate (Recall)**: Measures the percentage of true attacks successfully blocked by the system.
- **False Positive Rate**: Checks the validity of the generic packets allowed.
- **Response Time**: Ensure the API processes the network latency optimally without creating a bottleneck.

## 6. Conclusion
This IDS project successfully ties together Machine Learning robustness with software engineering best practices. It bridges the gap between theoretical ML classification and practical, deployable security monitoring, delivering high-accuracy intrusion detection in a user-friendly package.

## 7. Future Enhancements
- Live integration with real traffic inputs (`tcpdump` / `Wireshark`).
- Expansion of the model to Deep Learning approaches (e.g., LSTMs) for sequential packet payload analysis.
- Deployment via Docker containers onto cloud platforms (AWS, GCP).
