import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib
import json
import pandas as pd

class HomePageAnalyzer:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            max_features=1000,
            stop_words='english',
            ngram_range=(1, 2)
        )
        self.engagement_model = RandomForestClassifier(
            n_estimators=100,
            random_state=42
        )
        self.content_categories = [
            'general',
            'news',
            'entertainment',
            'sports',
            'technology',
            'politics'
        ]
        
        # Content rating system
        self.content_ratings = {
            'G': 'General Audience',
            'PG': 'Parental Guidance',
            'PG-13': 'Parental Guidance for children under 13',
            'R': 'Restricted - 18+ only',
            'NC-17': 'Adults Only'
        }
        
        self.age_verified = False
        self.allowed_ratings = ['G']  # Default to general audience only
        
    def set_user_preferences(self, is_age_verified: bool, age: int):
        """Update user preferences and set allowed content ratings"""
        self.age_verified = is_age_verified
        
        # Set allowed ratings based on verified age
        if is_age_verified:
            if age >= 18:
                self.allowed_ratings = ['G', 'PG', 'PG-13', 'R']
            elif age >= 13:
                self.allowed_ratings = ['G', 'PG', 'PG-13']
            else:
                self.allowed_ratings = ['G', 'PG']
        else:
            self.allowed_ratings = ['G']  # Restrict to general content only

    def filter_content_by_preferences(self, content_data):
        """Filter content based on age verification and content rating"""
        df = pd.DataFrame(content_data)
        
        # Filter based on content rating
        if 'content_rating' in df.columns:
            df = df[df['content_rating'].isin(self.allowed_ratings)]
            
        return df
        
    def determine_content_rating(self, content: str, metadata: dict) -> str:
        """Determine content rating based on text analysis and metadata"""
        try:
            # List of keywords/patterns that might indicate mature content
            mature_keywords = [
                'violence', 'explicit', 'mature', 'adult', 'nsfw',
                'drugs', 'alcohol', 'gambling'
            ]
            
            # Check content and metadata for mature themes
            content_lower = content.lower()
            has_mature_keywords = any(keyword in content_lower for keyword in mature_keywords)
            
            # Determine rating based on content analysis
            if metadata.get('is_adult_content', False):
                return 'R'
            elif has_mature_keywords:
                return 'PG-13'
            else:
                return 'G'
                
        except Exception as e:
            print(f"Error determining content rating: {str(e)}")
            return 'PG-13'  # Default to PG-13 if analysis fails

    def analyze_post_content(self, posts_data):
        """Analyze post content to extract key features and patterns"""
        try:
            # Convert and filter posts data
            df = self.filter_content_by_preferences(posts_data)
            
            # Extract text features
            if 'content' in df.columns:
                text_features = self.vectorizer.fit_transform(df['content'])
                
                # Get most common topics/terms
                feature_names = self.vectorizer.get_feature_names_out()
                top_terms = pd.DataFrame(
                    text_features.sum(axis=0).T,
                    index=feature_names,
                    columns=['frequency']
                ).sort_values('frequency', ascending=False)
                
                return {
                    'top_topics': top_terms.head(10).to_dict()['frequency'],
                    'avg_post_length': df['content'].str.len().mean(),
                    'total_posts': len(df)
                }
            return None
        except Exception as e:
            print(f"Error analyzing post content: {str(e)}")
            return None

    def analyze_stories(self, stories_data):
        """Analyze stories engagement and patterns"""
        try:
            # Filter stories based on user preferences
            df = self.filter_content_by_preferences(stories_data)
            
            stories_analysis = {
                'total_stories': len(df),
                'media_type_distribution': df['type'].value_counts().to_dict(),
                'premium_stories_percent': (df['isPremium'].sum() / len(df)) * 100,
                'viewed_stories_percent': (df['isViewed'].sum() / len(df)) * 100
            }
            
            if 'duration' in df.columns:
                stories_analysis['avg_duration'] = df['duration'].mean()
                
            return stories_analysis
        except Exception as e:
            print(f"Error analyzing stories: {str(e)}")
            return None

    def predict_engagement(self, content_features):
        """Predict potential engagement based on content features"""
        try:
            # Example features that could affect engagement:
            # - Post length
            # - Time of day
            # - Media presence
            # - User following count
            # - Historical engagement rate
            
            X = np.array(list(content_features.values())).reshape(1, -1)
            engagement_score = self.engagement_model.predict_proba(X)[0]
            
            return {
                'engagement_score': float(engagement_score[1]),
                'confidence': np.max(engagement_score)
            }
        except Exception as e:
            print(f"Error predicting engagement: {str(e)}")
            return None

    def categorize_content(self, content):
        """Categorize content into predefined categories"""
        try:
            # Use TF-IDF features to classify content
            content_vector = self.vectorizer.transform([content])
            
            # Example category scores (in practice, would use a trained classifier)
            category_scores = {
                category: np.random.random() 
                for category in self.content_categories
            }
            
            # Get top 2 categories
            top_categories = sorted(
                category_scores.items(),
                key=lambda x: x[1],
                reverse=True
            )[:2]
            
            return [cat[0] for cat in top_categories]
        except Exception as e:
            print(f"Error categorizing content: {str(e)}")
            return ['general']

    def generate_content_recommendations(self, user_data, content_history):
        """Generate personalized content recommendations"""
        try:
            # Filter content history based on preferences
            filtered_history = self.filter_content_by_preferences(content_history)
            
            recommendations = {
                'suggested_topics': [],
                'optimal_posting_times': [],
                'content_type_distribution': {},
                'recommended_categories': []
            }
            
            if content_history:
                # Analyze user's content consumption patterns
                df = pd.DataFrame(content_history)
                
                # Get preferred content types
                if 'type' in df.columns:
                    recommendations['content_type_distribution'] = \
                        df['type'].value_counts(normalize=True).to_dict()
                
                # Analyze engagement times
                if 'timestamp' in df.columns:
                    df['hour'] = pd.to_datetime(df['timestamp']).dt.hour
                    peak_hours = df.groupby('hour')['engagement'].mean().nlargest(3)
                    recommendations['optimal_posting_times'] = peak_hours.index.tolist()
                
            return recommendations
        except Exception as e:
            print(f"Error generating recommendations: {str(e)}")
            return None

    def export_analysis(self, output_path, analysis_results):
        """Export analysis results to a JSON file"""
        try:
            with open(output_path, 'w') as f:
                json.dump(analysis_results, f, indent=2)
            print(f"Analysis results exported to {output_path}")
        except Exception as e:
            print(f"Error exporting analysis: {str(e)}")

def main():
    import argparse
    import sys
    
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Homepage content analysis')
    parser.add_argument('--data', type=str, required=True, help='Path to JSON data file')
    parser.add_argument('--age', type=int, required=True, help='User age')
    parser.add_argument('--verified', type=str, required=True, help='Age verification status')
    
    args = parser.parse_args()
    
    # Load input data
    try:
        with open(args.data, 'r') as f:
            input_data = json.load(f)
    except Exception as e:
        print(json.dumps({'error': f'Failed to load data: {str(e)}'}))
        sys.exit(1)
    
    # Initialize analyzer
    analyzer = HomePageAnalyzer()
    
    # Set user preferences with age verification
    is_verified = args.verified.lower() == 'true'
    analyzer.set_user_preferences(is_age_verified=is_verified, age=args.age)
    
    # Analyze provided data
    try:
        posts = input_data.get('posts', [])
        stories = input_data.get('stories', [])
        
        # Perform analysis
        results = {
            "post_analysis": analyzer.analyze_post_content(posts),
            "stories_analysis": analyzer.analyze_stories(stories),
            "recommendations": analyzer.generate_content_recommendations(
                user_data=input_data.get('user_data', {}),
                content_history=posts
            )
        }
        
        # Print results as JSON to stdout for the API to capture
        print(json.dumps(results))
        
    except Exception as e:
        print(json.dumps({'error': f'Analysis failed: {str(e)}'}))
        sys.exit(1)

if __name__ == "__main__":
    main()
