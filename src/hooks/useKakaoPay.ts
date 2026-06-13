import { supabase } from '../lib/supabase'

export function useKakaoPay() {
  const startPayment = async (userId: string) => {
    const { data, error } = await supabase.functions.invoke('kakaopay-ready', {
      body: { userId },
    })
    if (error || !data?.next_redirect_pc_url) {
      throw new Error('결제 요청에 실패했습니다.')
    }
    localStorage.setItem('kakaopay_tid', data.tid)
    localStorage.setItem('kakaopay_order_id', data.order_id)
    localStorage.setItem('kakaopay_user_id', userId)
    window.location.href = data.next_redirect_pc_url
  }

  return { startPayment }
}
