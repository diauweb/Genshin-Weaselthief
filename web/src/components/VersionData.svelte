<script>
    export let data
    
    function click (hs) {
        const b = confirm(`set version to ${hs}?`)
        if (b) {
            fetch('/api/set_version', { 
                method: 'PUT',
                body: JSON.stringify({ version: hs }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            document.location.reload()
        }
    }
</script>

<fluent-accordion-item>
    <fluent-button on:click={() => click(data.hash)}>Checkout here</fluent-button>
    <span slot="heading">
        {data.fullVersion}
    </span>
    <pre>{JSON.stringify(data, null, 2)}</pre>
</fluent-accordion-item>