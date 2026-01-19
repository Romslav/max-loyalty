import axios from 'axios'

export interface Invoice {
  id: string
  invoiceNumber: string
  restaurantId: string
  amount: number
  currency: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  dueDate: string
  issuedDate: string
  paidDate?: string
  description: string
  items: InvoiceItem[]
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface CreateInvoiceDTO {
  restaurantId: string
  amount: number
  dueDate: string
  description: string
  items: CreateInvoiceItemDTO[]
}

export interface CreateInvoiceItemDTO {
  description: string
  quantity: number
  unitPrice: number
}

export interface InvoicesResponse {
  data: Invoice[]
  total: number
  page: number
  limit: number
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const apiClient = axios.create({
  baseURL: API_URL,
})

class BillingService {
  /**
   * Get invoices with pagination
   */
  async getInvoices(
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<InvoicesResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })

      if (status) {
        params.append('status', status)
      }

      const response = await apiClient.get<InvoicesResponse>(
        `/billing/invoices?${params.toString()}`
      )
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Get invoice by ID
   */
  async getInvoiceById(id: string): Promise<Invoice> {
    try {
      const response = await apiClient.get<{ data: Invoice }>(
        `/billing/invoices/${id}`
      )
      return response.data.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Create new invoice
   */
  async createInvoice(data: CreateInvoiceDTO): Promise<Invoice> {
    try {
      const response = await apiClient.post<{ data: Invoice }>(
        '/billing/invoices',
        data
      )
      return response.data.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Mark invoice as paid
   */
  async markInvoicePaid(id: string, paymentDate?: string): Promise<Invoice> {
    try {
      const response = await apiClient.put<{ data: Invoice }>(
        `/billing/invoices/${id}/pay`,
        { paymentDate }
      )
      return response.data.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Send invoice email
   */
  async sendInvoiceEmail(id: string, email: string): Promise<void> {
    try {
      await apiClient.post(`/billing/invoices/${id}/send`, { email })
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Download invoice as PDF
   */
  async downloadInvoicePDF(id: string): Promise<Blob> {
    try {
      const response = await apiClient.get(`/billing/invoices/${id}/pdf`, {
        responseType: 'blob',
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message
      return new Error(message || 'An error occurred')
    }
    return error instanceof Error ? error : new Error('An unknown error occurred')
  }
}

export const billingService = new BillingService()
