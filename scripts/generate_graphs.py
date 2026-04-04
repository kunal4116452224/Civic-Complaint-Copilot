import json
import matplotlib.pyplot as plt
from collections import Counter
import os

# Set paths
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
json_path = os.path.join(base_dir, "public", "data", "complaints.json")
output_dir = os.path.join(base_dir, "public", "graphs")

# Ensure output directory exists
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Load data
try:
    with open(json_path, 'r') as f:
        data = json.load(f)
except Exception as e:
    print(f"Error loading JSON: {e}")
    exit(1)

# Aggregate data
status_counts = Counter([c["status"] for c in data])
type_counts = Counter([c["type"].capitalize() for c in data])
location_counts = Counter([c["location"] for c in data])

# Use a clean, modern style
plt.rcParams.update({
    'figure.facecolor': '#0f172a',  # match slate-900
    'axes.facecolor': '#0f172a',
    'text.color': 'white',
    'axes.labelcolor': 'white',
    'xtick.color': 'white',
    'ytick.color': 'white',
    'grid.color': '#334155'
})

# 1. Pie Chart (Status)
plt.figure(figsize=(8, 6))
colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'] # emerald, blue, amber, red
plt.pie(status_counts.values(), labels=status_counts.keys(), autopct='%1.1f%%', 
        colors=colors, startangle=140, textprops={'fontsize': 12})
plt.title("Complaint Status Distribution", pad=20, fontsize=16, fontweight='bold')
plt.axis('equal')
plt.savefig(os.path.join(output_dir, "status.png"), transparent=False, dpi=150)
print("Generated status.png")

# 2. Bar Chart (Type)
plt.figure(figsize=(8, 6))
plt.bar(type_counts.keys(), type_counts.values(), color='#06b6d4') # cyan-500
plt.title("Complaints by Type", pad=20, fontsize=16, fontweight='bold')
plt.ylabel("Number of Complaints")
plt.grid(axis='y', linestyle='--', alpha=0.3)
plt.savefig(os.path.join(output_dir, "type.png"), transparent=False, dpi=150)
print("Generated type.png")

# 3. Bar Chart (Location)
plt.figure(figsize=(10, 6))
# Sort locations by count
sorted_locations = dict(sorted(location_counts.items(), key=lambda x: x[1], reverse=True))
plt.bar(sorted_locations.keys(), sorted_locations.values(), color='#8b5cf6') # violet-500
plt.title("Complaints by Location", pad=20, fontsize=16, fontweight='bold')
plt.xticks(rotation=30, ha='right')
plt.ylabel("Number of Complaints")
plt.grid(axis='y', linestyle='--', alpha=0.3)
plt.tight_layout()
plt.savefig(os.path.join(output_dir, "location.png"), transparent=False, dpi=150)
print("Generated location.png")

print("All graphs generated successfully in /public/graphs/")
