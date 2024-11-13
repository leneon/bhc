# Utilisez une image Maven pour construire le projet
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# Copiez le fichier pom.xml et téléchargez les dépendances
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiez le reste du code source
COPY src ./src

# Compilez le projet
RUN mvn clean package -DskipTests

# Utilisez une image JDK pour exécuter l'application
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copiez le fichier JAR de l'image précédente
COPY --from=build /app/target/*.jar app.jar

# Exposez le port sur lequel votre application écoute (par défaut Spring Boot écoute sur le port 8080)
EXPOSE 8080

# Commande pour exécuter l'application
ENTRYPOINT ["java", "-jar", "app.jar"]
