# 📁 Dossier des Polices (Fonts)

## 📍 Où placer vos fichiers de polices

Placez vos fichiers de polices (`.ttf` ou `.otf`) **directement dans ce dossier** :

```
src/assets/fonts/
├── VotrePolice-Regular.ttf
├── VotrePolice-Bold.ttf
├── VotrePolice-Italic.ttf
└── ...
```

## 📝 Comment utiliser les polices dans le code

Une fois les fichiers placés ici, utilisez-les dans vos styles React Native :

```typescript
const styles = StyleSheet.create({
  text: {
    fontFamily: 'VotrePolice-Regular', // Nom du fichier SANS l'extension
    fontSize: 16,
  },
});
```

## ⚙️ Configuration automatique

React Native détecte automatiquement les polices dans ce dossier.
Si nécessaire, exécutez après avoir ajouté des polices :
```bash
npx react-native-asset
```

## ✅ Exemple

Si vous placez `Roboto-Regular.ttf` ici, utilisez :
```typescript
fontFamily: 'Roboto-Regular'
```

