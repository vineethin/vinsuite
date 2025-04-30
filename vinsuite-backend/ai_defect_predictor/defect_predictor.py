
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib

# Load dataset
data = pd.read_csv('sample_historical_defects.csv')

# Create binary label for defects
data['Defective'] = 1

# Create synthetic non-defective data
non_defective_samples = data.sample(n=len(data), random_state=42).copy()
non_defective_samples['Defective'] = 0

# Combine datasets
combined_data = pd.concat([data, non_defective_samples])

# Convert Severity to numeric
severity_mapping = {'Low': 1, 'Medium': 2, 'High': 3, 'Critical': 4}
combined_data['Severity_Score'] = combined_data['Severity'].map(severity_mapping)

# One-hot encode Component and Developer
component_dummies = pd.get_dummies(combined_data['Component'], prefix='Comp')
developer_dummies = pd.get_dummies(combined_data['Developer'], prefix='Dev')

# Feature: Change Size
combined_data['Change_Size'] = combined_data['Lines_Added'] + combined_data['Lines_Removed']

# Feature: Days Since Commit
combined_data['Commit_Date'] = pd.to_datetime(combined_data['Commit_Date'])
combined_data['Days_Since_Commit'] = (pd.Timestamp.now() - combined_data['Commit_Date']).dt.days

# Final feature set
features = pd.concat([
    combined_data[['Change_Size', 'Severity_Score', 'Days_Since_Commit']],
    component_dummies,
    developer_dummies
], axis=1)

labels = combined_data['Defective']

# Split data
X_train, X_test, y_train, y_test = train_test_split(features, labels, test_size=0.25, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
print("✅ Accuracy:", accuracy_score(y_test, y_pred))
print("\n📊 Classification Report:\n", classification_report(y_test, y_pred))

# Save model for future use
joblib.dump(model, 'defect_predictor_model.pkl')
print("💾 Model saved as 'defect_predictor_model.pkl'")
