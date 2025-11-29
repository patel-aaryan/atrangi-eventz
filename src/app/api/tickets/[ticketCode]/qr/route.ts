import QRCode from "qrcode";

interface RouteParams {
  params: {
    ticketCode: string;
  };
}

export async function GET(
  _request: Request,
  { params }: RouteParams
): Promise<Response> {
  const ticketCode = params.ticketCode;

  if (!ticketCode) {
    return new Response("Ticket code is required", { status: 400 });
  }

  try {
    const buffer = await QRCode.toBuffer(ticketCode, {
      type: "png",
      errorCorrectionLevel: "H",
      margin: 1,
      scale: 6,
    });

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error generating QR code image:", error);
    return new Response("Failed to generate QR code", { status: 500 });
  }
}


