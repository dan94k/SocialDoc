import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#1a1a1a",
    lineHeight: 1.6,
  },
  title: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 30,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginTop: 20,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  paragraph: {
    marginBottom: 6,
    textAlign: "justify",
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  listItem: {
    marginBottom: 4,
    paddingLeft: 15,
  },
  clauseNumber: {
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  clauseText: {
    marginBottom: 10,
    textAlign: "justify",
  },
  signatureSection: {
    marginTop: 60,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBlock: {
    width: "45%",
    alignItems: "center",
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
    width: "100%",
    marginBottom: 6,
  },
  signatureName: {
    fontSize: 10,
    textAlign: "center",
  },
  signatureLabel: {
    fontSize: 9,
    color: "#666",
    textAlign: "center",
  },
  dateLocation: {
    marginTop: 40,
    textAlign: "center",
    fontSize: 10,
    color: "#666",
  },
  watermark: {
    position: "absolute",
    top: "40%",
    left: "10%",
    transform: "rotate(-45deg)",
    fontSize: 48,
    color: "#000",
    opacity: 0.06,
    fontFamily: "Helvetica-Bold",
  },
});
