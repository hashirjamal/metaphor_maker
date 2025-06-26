"use server"

export const generateImage = async (metaphorName: string) => {
    const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_WORKER_AI_TOKEN;
    const model = "@cf/black-forest-labs/flux-1-schnell"
    const url = process.env.CLOUDFLARE_URL + model || "";

    const prompt = `Generate an image for ${metaphorName}. Keep it very simple and basic`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${CLOUDFLARE_API_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt,
                height: 256,
                width: 256,
            }),
        });

        const data = await response.json();
        console.log("Response received from image model");
        if (!data.success) throw new Error("Error while generating image")
        return data?.result?.image;
    } catch (error) {
        console.error("Error:", error);
        throw new Error(error instanceof Error ? error.message : "Something went wrong while generating image"); // or throw error if you want to handle it upstream
    }
};
