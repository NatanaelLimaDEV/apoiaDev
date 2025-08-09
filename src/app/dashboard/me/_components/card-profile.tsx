import Image from "next/image";
import { Name } from "./name";
import { Description } from "./description";

interface CardProfileProps {
    user: {
        id: string;
        name: string | null;
        userName: string | null;
        bio: string | null;
        image: string | null
    }
}

export function CardProfile({ user }: CardProfileProps) {
    return (
        <section className="w-full flex flex-col items-center mx-auto px-4">
            <div>
                <Image
                    src={user.image ?? "https://avatars.githubusercontent.com/u/173175325?s=400&v=4"}
                    alt="User Avatar"
                    width={104}
                    height={104}
                    className="rounded-xl bg-gray-50 object-cover border-4 border-white hover:shadow-xl duration-300"
                    priority
                    quality={100}
                />
            </div>

            <div>
                <Name 
                    initialName={user.name ?? "Digite seu nome..."}
                />

                <Description 
                    initialDescription={user.bio ?? "Digite sua descrição..."}
                />
            </div>
        </section>
    )
}