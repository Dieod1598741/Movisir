import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { Z_INDEX } from '../../constants/zIndex';

interface Movie {
    id: number;
    title: string;
    genre: string;
    image: string;
}

interface TinderCardProps {
    movie: Movie;
    onSwipe: (direction: 'left' | 'right') => void;
    index: number;
}

export default function TinderCard({ movie, onSwipe, index }: TinderCardProps) {
    const controls = useAnimation();
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

    // Color overlays for feedback
    const likeOpacity = useTransform(x, [0, 150], [0, 1]);
    const dislikeOpacity = useTransform(x, [-150, 0], [1, 0]);

    const handleDragEnd = async (_: any, info: any) => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;

        if (offset > 100 || velocity > 500) {
            await controls.start({ x: 500, opacity: 0 });
            onSwipe('right');
        } else if (offset < -100 || velocity < -500) {
            await controls.start({ x: -500, opacity: 0 });
            onSwipe('left');
        } else {
            controls.start({ x: 0 });
        }
    };

    return (
        <motion.div
            style={{
                x,
                rotate,
                opacity,
                zIndex: Z_INDEX.BASE + index,
                position: 'absolute',
                top: 0,
                cursor: 'grab',
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            animate={controls}
            whileTap={{ cursor: 'grabbing' }}
            className="w-full max-w-sm aspect-[3/4] bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
        >
            {/* Image */}
            <div className="h-3/4 w-full relative">
                <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-full object-cover pointer-events-none"
                />

                {/* Like Overlay */}
                <motion.div
                    style={{ opacity: likeOpacity }}
                    className="absolute inset-0 bg-green-500/30 flex items-center justify-center pointer-events-none"
                >
                    <span className="text-6xl font-bold text-white border-4 border-white rounded-lg px-4 transform -rotate-12">LIKE</span>
                </motion.div>

                {/* Dislike Overlay */}
                <motion.div
                    style={{ opacity: dislikeOpacity }}
                    className="absolute inset-0 bg-red-500/30 flex items-center justify-center pointer-events-none"
                >
                    <span className="text-6xl font-bold text-white border-4 border-white rounded-lg px-4 transform rotate-12">NOPE</span>
                </motion.div>
            </div>

            {/* Content */}
            <div className="h-1/4 p-6 flex flex-col justify-center bg-white dark:bg-gray-800">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{movie.title}</h3>
                <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium w-fit">
                    {movie.genre}
                </span>
            </div>
        </motion.div>
    );
}
