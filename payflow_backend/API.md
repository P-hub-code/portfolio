# Payflow API

Ce document définit le contrat d'interface (API) entre `payflow_frontend` et `payflow_backend`.

## 1. Base URLs

- **Local** : `http://localhost:3001`
- **Production** : `https://payflow-backend-git-main-dev-mobile.vercel.app`

Le frontend doit utiliser une variable d'environnement `NEXT_PUBLIC_API_URL` pour cibler la bonne URL dynamiquement, et ne jamais hardcoder l'URL dans les composants.

## 2. Authentication

Actuellement, l'endpoint d'initialisation n'expose pas la clé secrète Paystack au frontend. 
Le frontend n'a besoin d'aucune authentification spécifique pour appeler l'API de paiement, la sécurité des communications avec Paystack est garantie et masquée par le backend. 

*Aucun secret (clés Paystack, URL de la base de données, etc.) ne doit transiter vers le frontend.*

## 3. GET /health

Vérifie l'état de santé de l'API. Utilisé pour les sondes et vérifications de déploiement.

- **Méthode** : `GET`
- **Chemin** : `/health`
- **Headers** : (Aucun requis)

### Exemple de requête (Locale)
```http
GET http://localhost:3001/health
```

### Réponse HTTP attendue
**Statut HTTP** : `200 OK`

```json
{
  "status": "ok"
}
```

## 4. POST /payments/initialize

Initialise une transaction de paiement auprès de Paystack via le backend.

- **Méthode** : `POST`
- **Chemin** : `/payments/initialize`
- **Headers** : 
  - `Content-Type: application/json`

### Body attendu

- **`customerName`** (`string`, obligatoire) : Le nom complet du client.
- **`email`** (`string`, obligatoire) : L'adresse email du client. Elle doit être valide.
- **`customerPhone`** (`string`, optionnel) : Le numéro de téléphone du client.
- **`description`** (`string`, optionnel) : Une description de la commande.
- **`amount`** (`number`, obligatoire) : Le montant affiché au client en FCFA. **Attention :** Le backend effectue automatiquement la conversion en centimes (multiplication par 100) pour l'API Paystack. Le frontend ne doit **PAS** envoyer directement le montant converti. 
- **`paymentMethod`** (`string`, optionnel) : La méthode de paiement choisie (ex: `card`, `mobile_money`).

### Exemple de requête
```json
{
  "customerName": "John Doe",
  "email": "test@example.com",
  "customerPhone": "+2250102030405",
  "description": "Achat de test",
  "amount": 5000,
  "paymentMethod": "mobile_money"
}
```
*(Dans cet exemple, le backend enverra `500000` à Paystack pour refléter 5000 FCFA).*

### Réponse HTTP attendue
**Statut HTTP** : `201 Created`

```json
{
  "status": true,
  "authorization_url": "https://checkout.paystack.com/yohgew5v9wg9rva",
  "reference": "PAYFLOW-A5FA1A64A7A2821A"
}
```

### Rôle des champs de réponse

- **`authorization_url`** : L'URL vers laquelle le frontend doit rediriger l'utilisateur pour qu'il procède au paiement sur l'interface sécurisée de Paystack.
- **`reference`** : La référence unique de la transaction générée par le backend (format `PAYFLOW-...`). Elle servira à suivre le statut du paiement.
- **`status`** : Indique si l'initialisation a réussi.

## 5. Error handling

En cas d'erreur de validation ou de communication, le backend renvoie des exceptions HTTP standards.

### Erreurs possibles :
- **`400 Bad Request`** : Email invalide ou montant inférieur ou égal à 0.
- **`500 Internal Server Error`** : Erreur de communication avec Paystack, ou problème de configuration serveur (ex: variable d'environnement manquante).

Le corps de la réponse contiendra un message d'erreur standard NestJS, sans **jamais exposer de clés secrètes**.
```json
{
  "message": "Invalid email address",
  "error": "Bad Request",
  "statusCode": 400
}
```

## 6. Frontend integration notes

- **CORS** : CORS n'est actuellement pas configuré sur le backend. CORS devra être configuré lorsque le frontend sera connecté pour autoriser les requêtes cross-origin.
- **Montant** : Le frontend doit toujours manipuler le montant en FCFA naturel (ex: 5000) et laisser le backend se charger des règles de l'API cible.
