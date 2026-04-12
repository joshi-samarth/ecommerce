import PropTypes from 'prop-types';

export default function RatingStars({ rating = 0, numReviews = 0, interactive = false, onRatingClick = null }) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    const handleStarClick = (starValue) => {
        if (interactive && onRatingClick) {
            onRatingClick(starValue);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => handleStarClick(star)}
                        className={`${interactive ? 'cursor-pointer' : 'cursor-default'} transition-colors`}
                        disabled={!interactive}
                    >
                        {star <= fullStars ? (
                            <svg
                                className="w-5 h-5 text-yellow-400 fill-current"
                                viewBox="0 0 20 20"
                            >
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                        ) : star - 1 < rating && hasHalfStar ? (
                            <div className="relative w-5 h-5">
                                <svg className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 20 20">
                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                </svg>
                                <div className="absolute top-0 left-0 overflow-hidden w-2.5 h-5">
                                    <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                </div>
                            </div>
                        ) : (
                            <svg
                                className="w-5 h-5 text-gray-300 fill-current"
                                viewBox="0 0 20 20"
                            >
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                        )}
                    </button>
                ))}
            </div>
            {numReviews > 0 && (
                <span className="text-sm text-gray-600">
                    ({numReviews} {numReviews === 1 ? 'review' : 'reviews'})
                </span>
            )}
        </div>
    );
}

RatingStars.propTypes = {
    rating: PropTypes.number,
    numReviews: PropTypes.number,
    interactive: PropTypes.bool,
    onRatingClick: PropTypes.func,
};
