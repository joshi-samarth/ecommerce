export default function RatingStars({
    rating = 0,
    numReviews = 0,
    size = 'md',
    interactive = false,
    onRate = null,
}) {
    const sizeMap = {
        sm: { star: 'w-3 h-3', gap: 'gap-0.5', text: 'text-xs' },
        md: { star: 'w-4 h-4', gap: 'gap-1', text: 'text-sm' },
        lg: { star: 'w-6 h-6', gap: 'gap-1', text: 'text-base' },
    };

    const { star, gap, text } = sizeMap[size];

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const fillPercentage = Math.max(0, Math.min(1, rating - i + 1));
            let starLabel = '☆'; // Empty star

            if (fillPercentage === 1) {
                starLabel = '★'; // Full star
            } else if (fillPercentage === 0.5) {
                starLabel = '⯨'; // Half star
            } else if (fillPercentage > 0) {
                starLabel = '⯨'; // Half star
            }

            stars.push(
                <span
                    key={i}
                    className={`${star} cursor-pointer transition-transform hover:scale-110 text-yellow-400`}
                    onClick={() => interactive && onRate && onRate(i)}
                    role={interactive ? 'button' : 'presentation'}
                    tabIndex={interactive ? 0 : -1}
                    onKeyDown={(e) => interactive && onRate && e.key === 'Enter' && onRate(i)}
                >
                    {starLabel}
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="flex items-center gap-2">
            <div className={`flex ${gap} ${interactive ? 'cursor-pointer' : ''}`}>
                {renderStars()}
            </div>
            {numReviews > 0 && (
                <span className={`text-gray-500 ${text}`}>
                    ({numReviews} {numReviews === 1 ? 'review' : 'reviews'})
                </span>
            )}
        </div>
    );
}
