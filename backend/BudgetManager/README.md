# Budget Manager

Application de gestion budgétaire simple.

## Caractéristiques

- Gestion des transactions
- Catégorisation des dépenses
- Authentification JWT stockée en cookies HttpOnly (access + refresh token)
- Gestion des comptes utilisateur
- Administration

## Technologies

- .NET 10
- ASP.NET Core
- Entity Framework Core
- SQL Server

## Démarrage

1. Ouvrir `BudgetManager.slnx` avec Visual Studio
2. Définir `BudgetManager.API` comme projet de démarrage
3. Lancer avec le profil `https`

L'API sera disponible sur `https://localhost:7208`

### Commandes

```bash
# Lancer l'API
dotnet run --project BudgetManager.API

# Migrations base de données
dotnet ef database update
```

## Structure

```
BudgetManager/
├── BudgetManager.API              # Contrôleurs & endpoints
├── BudgetManager.Application      # Logique métier
├── BudgetManager.Domain           # Modèles
├── BudgetManager.Infrastructure   # Base de données
└── BudgetManager.SharedLibrary    # Utilitaires
```

## Endpoints API

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/transaction` | GET/POST | Transactions |
| `/api/category` | GET/POST | Catégories |
| `/api/auth/login` | POST | Authentification |
| `/api/account` | GET/POST | Comptes |
| `/api/usermanagement` | GET/POST | Utilisateurs |
