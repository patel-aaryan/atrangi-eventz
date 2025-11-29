/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  renderToBuffer,
} from "@react-pdf/renderer";

interface TicketForPdf {
  ticketCode: string;
  attendeeName: string;
  attendeeEmail: string;
  tierName: string;
  price: number;
  qrCodeData: string;
}

export interface TicketPdfPayload {
  orderNumber: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  buyerName: string;
  tickets: TicketForPdf[];
}

interface GeneratePdfResult {
  filename: string;
  contentType: string;
  buffer: Buffer;
}

const styles = StyleSheet.create({
  page: {
    padding: 32,
    backgroundColor: "#020617",
    fontFamily: "Helvetica",
  },
  ticketCard: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#f97316",
    backgroundColor: "#020617",
    padding: 20,
    flexDirection: "column",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "#f9fafb",
  },
  orderBadge: {
    fontSize: 10,
    color: "#f97316",
    textTransform: "uppercase",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  metaBlock: {
    flexDirection: "column",
  },
  metaLabel: {
    fontSize: 9,
    color: "#9ca3af",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 11,
    color: "#e5e7eb",
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#1f2937",
    marginVertical: 12,
  },
  bodyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    gap: 16,
  },
  leftColumn: {
    flex: 1.4,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  rightColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  ticketTier: {
    fontSize: 14,
    fontWeight: 600,
    color: "#f97316",
    marginBottom: 4,
  },
  attendeeName: {
    fontSize: 13,
    fontWeight: 500,
    color: "#f9fafb",
    marginBottom: 2,
  },
  attendeeEmail: {
    fontSize: 10,
    color: "#9ca3af",
    marginBottom: 8,
  },
  ticketCode: {
    fontSize: 11,
    color: "#e5e7eb",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  priceLabel: {
    fontSize: 10,
    color: "#9ca3af",
  },
  priceValue: {
    fontSize: 14,
    fontWeight: 700,
    color: "#f9fafb",
  },
  qrWrapper: {
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1f2937",
    backgroundColor: "#020617",
    alignItems: "center",
    justifyContent: "center",
  },
  qrImage: {
    width: 160,
    height: 160,
  },
  qrCaption: {
    fontSize: 9,
    color: "#9ca3af",
    marginTop: 6,
    textAlign: "center",
  },
  footerNote: {
    fontSize: 9,
    color: "#6b7280",
    marginTop: 12,
    textAlign: "center",
  },
});

function formatEventDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

interface TicketDocumentProps {
  payload: TicketPdfPayload;
}

function TicketDocument({ payload }: Readonly<TicketDocumentProps>) {
  const formattedDate = formatEventDate(payload.eventDate);

  return (
    <Document>
      {payload.tickets.map((ticket) => (
        <Page size="LETTER" style={styles.page} key={ticket.ticketCode}>
          <View style={styles.ticketCard}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.eventTitle}>{payload.eventTitle}</Text>
                <Text style={styles.orderBadge}>
                  Order {payload.orderNumber.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaBlock}>
                <Text style={styles.metaLabel}>Date & Time</Text>
                <Text style={styles.metaValue}>{formattedDate}</Text>
              </View>
              <View style={styles.metaBlock}>
                <Text style={styles.metaLabel}>Location</Text>
                <Text style={styles.metaValue}>{payload.eventLocation}</Text>
              </View>
              <View style={styles.metaBlock}>
                <Text style={styles.metaLabel}>Booked By</Text>
                <Text style={styles.metaValue}>{payload.buyerName}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.bodyRow}>
              <View style={styles.leftColumn}>
                <View>
                  <Text style={styles.ticketTier}>{ticket.tierName}</Text>
                  <Text style={styles.attendeeName}>{ticket.attendeeName}</Text>
                  <Text style={styles.attendeeEmail}>
                    {ticket.attendeeEmail}
                  </Text>
                  <Text style={styles.ticketCode}>
                    Ticket #{ticket.ticketCode}
                  </Text>
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Admit One</Text>
                  <Text style={styles.priceValue}>
                    ${ticket.price.toFixed(2)} CAD
                  </Text>
                </View>
              </View>

              <View style={styles.rightColumn}>
                <View style={styles.qrWrapper}>
                  <Image
                    style={styles.qrImage}
                    src={ticket.qrCodeData}
                    cache={false}
                  />
                  <Text style={styles.qrCaption}>
                    Present this QR code at the entrance
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.footerNote}>
              Please arrive 15 minutes early. Bring a valid photo ID that
              matches the attendee name. Tickets are non-transferable unless
              otherwise stated.
            </Text>
          </View>
        </Page>
      ))}
    </Document>
  );
}

export class PdfService {
  async generateTicketsPdf(
    payload: TicketPdfPayload
  ): Promise<GeneratePdfResult> {
    const document = <TicketDocument payload={payload} />;
    const buffer = await renderToBuffer(document);

    const safeEventTitle = payload.eventTitle
      .replaceAll(/[^a-z0-9]+/gi, "-")
      .replaceAll(/(^-+)|(-+$)/g, "")
      .toLowerCase();

    const filename = `${safeEventTitle || "tickets"}-order-${
      payload.orderNumber
    }.pdf`;

    return {
      filename,
      contentType: "application/pdf",
      buffer,
    };
  }
}
