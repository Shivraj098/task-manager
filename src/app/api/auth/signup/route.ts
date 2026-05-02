import { prisma } from "@/server/lib/prisma";
import bcrypt from "bcrypt";
import { signupSchema } from "@/server/validators/auth.validator";
import { successResponse, errorResponse } from "@/server/lib/api-response";
import { withErrorHandling } from "@/server/lib/with-errors";

export const POST = withErrorHandling(async (req: Request) => {
  const body = signupSchema.parse(await req.json());

  const existingUser = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (existingUser) {
    return errorResponse("User already exists");
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      passwordHash: hashedPassword,
    },
  });

  return successResponse({
    id: user.id,
    email: user.email,
  });
});