# Homepage Content Analysis

This ML module analyzes the homepage content including posts and stories to provide insights and recommendations.

## Features

- **Content Rating System**
  - G (General Audience) - Available to all users
  - PG (Parental Guidance) - Available to all verified users
  - PG-13 (Parental Guidance under 13) - Requires age verification (13+)
  - R (Restricted) - Requires age verification (18+)
  - NC-17 (Adults Only) - Requires age verification (18+)

- **Content Categories**
  - General news
  - Entertainment
  - Sports
  - Technology
  - Politics

- **Post Content Analysis**
  - Extract key topics and themes
  - Analyze post length and content patterns
  - Track total post metrics
  - Content categorization

- **Stories Analysis** 
  - Media type distribution (image/video)
  - Premium content metrics
  - Viewing patterns and engagement
  - Duration analysis
  - Content filtering based on preferences

- **Engagement Prediction**
  - ML-based engagement score prediction
  - Consider factors like post length, timing, media type
  - Confidence scoring for predictions

- **Content Recommendations**
  - Personalized topic suggestions
  - Optimal posting time analysis 
  - Content type distribution insights
  - Category-based recommendations

## Setup

1. Create a Python virtual environment:
```bash
python -m venv env
source env/bin/activate  # On Windows use: env\Scripts\activate
```

2. Install requirements:
```bash
pip install -r requirements.txt
```

## Usage

Run the analysis:
```bash
python homepage_analysis.py
```

This will:
1. Analyze sample posts and stories data
2. Generate insights and predictions
3. Export results to `homepage_analysis_results.json`

## Customizing Analysis

Modify the `main()` function in `homepage_analysis.py` to analyze your own data:

```python
# Initialize analyzer
analyzer = HomePageAnalyzer()

# Set user preferences with age verification
analyzer.set_user_preferences(
    is_age_verified=True,  # From DigiLocker verification
    age=25  # User's verified age
)

# Analyze your posts data
posts_data = [{
    "content": "Your post content",
    "type": "text",
    "category": "technology",
    "content_rating": "PG"  # Content rating (G, PG, PG-13, R, NC-17)
}]
post_analysis = analyzer.analyze_post_content(posts_data)

# Analyze your stories data
stories_data = [{
    "type": "image",
    "isPremium": True,
    "duration": 5,
    "category": "entertainment",
    "content_rating": "PG-13"  # Content rating based on content analysis
}] 
stories_analysis = analyzer.analyze_stories(stories_data)

# Get recommendations
recommendations = analyzer.generate_content_recommendations(
    user_data={},
    content_history=posts_data
)
```

## Output

The analysis results are saved in JSON format with the following structure:

```json
{
  "post_analysis": {
    "top_topics": {...},
    "avg_post_length": 123,
    "total_posts": 10,
    "categories": [...]
  },
  "stories_analysis": {
    "total_stories": 5,
    "media_type_distribution": {...},
    "premium_stories_percent": 20.0,
    "viewed_stories_percent": 80.0,
    "avg_duration": 7.5,
    "categories": [...]
  },
  "recommendations": {
    "suggested_topics": [...],
    "optimal_posting_times": [...],
    "content_type_distribution": {...},
    "recommended_categories": [...]
  }
}
