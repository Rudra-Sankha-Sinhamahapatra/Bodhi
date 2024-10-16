"use server";

import prisma from "@repo/db/client";

export async function geminiStore(
  prompt: string,
  response: string,
  inputToken: number,
  outputToken: number,
  userId: string,
) {
  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        promptHistory: {
          create: [
            {
              textContent: prompt,
            },
          ],
        },
        responseHistory: {
          create: [
            {
              textContent: response,
            },
          ],
        },
        tokenCount: {
          create: [
            {
              inputToken,
              outputToken,
            },
          ],
        },
      },
    });
  } catch (e) {
    console.log("Error: ", e);
  }
}
