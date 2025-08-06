#!/usr/bin/env node

/**
 * Script de diagnostic pour vérifier la configuration Cloudinary
 * Usage: node src/app/scripts/check-cloudinary.js
 */

import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';

console.log('🔍 Diagnostic Cloudinary...\n');

// 1. Vérifier les variables d'environnement
console.log('1. Variables d\'environnement:');
const requiredVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
let missingVars = [];

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`❌ ${varName}: NON DÉFINIE`);
    missingVars.push(varName);
  } else {
    console.log(`✅ ${varName}: ${value.substring(0, 8)}...`);
  }
});

if (missingVars.length > 0) {
  console.log(`\n🚨 PROBLÈME IDENTIFIÉ !`);
  console.log(`Variables manquantes: ${missingVars.join(', ')}`);
  console.log(`\nSolution: Ajoutez ces variables dans votre fichier .env.local`);
  process.exit(1);
}

// 2. Tester la configuration Cloudinary
console.log('\n2. Test de configuration Cloudinary:');
try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('✅ Configuration Cloudinary initialisée');
} catch (error) {
  console.log('❌ Erreur de configuration:', error.message);
  process.exit(1);
}

// 3. Tester la connexion à Cloudinary
console.log('\n3. Test de connexion Cloudinary:');
try {
  const result = await cloudinary.api.ping();
  console.log('✅ Connexion Cloudinary réussie:', result);
} catch (error) {
  console.log('❌ Erreur de connexion:', error.message);
  console.log('Vérifiez vos identifiants Cloudinary');
  process.exit(1);
}

// 4. Test d'upload simple
console.log('\n4. Test d\'upload simple:');
try {
  // Créer une image de test très simple (1x1 pixel transparent PNG)
  const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  
  const uploadResult = await cloudinary.uploader.upload(testImageBase64, {
    folder: 'artworks',
    public_id: 'test_upload_' + Date.now(),
  });
  
  console.log('✅ Upload de test réussi:');
  console.log(`   URL: ${uploadResult.secure_url}`);
  console.log(`   Public ID: ${uploadResult.public_id}`);
  
  // Nettoyer l'image de test
  await cloudinary.uploader.destroy(uploadResult.public_id);
  console.log('✅ Image de test supprimée');
  
} catch (error) {
  console.log('❌ Erreur d\'upload:', error.message);
  console.log('Vérifiez vos permissions Cloudinary');
  process.exit(1);
}

console.log('\n🎉 Configuration Cloudinary parfaitement fonctionnelle !');
console.log('L\'upload d\'images devrait maintenant fonctionner.');