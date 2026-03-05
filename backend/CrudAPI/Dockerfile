# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY backend/CrudAPI/CrudAPI.csproj backend/CrudAPI/
RUN dotnet restore backend/CrudAPI/CrudAPI.csproj

# Copy the rest and publish
COPY backend/CrudAPI/ backend/CrudAPI/
RUN dotnet publish backend/CrudAPI/CrudAPI.csproj -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Render will set PORT; default to 8080 for local container runs
ENV PORT=8080

COPY --from=build /app/publish .

EXPOSE 8080
ENTRYPOINT ["dotnet", "CrudAPI.dll"]
